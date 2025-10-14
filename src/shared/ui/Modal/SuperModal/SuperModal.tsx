import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react'
import s from '../Modal.module.scss'
import { ModalHeader } from '@/shared/ui/Modal/SuperModal/ModalHeader/ModalHeader'
import { Modal } from '@/shared/ui/Modal/Modal'
import { SideBarWarning } from '@/shared/ui/Modal/SideBarWarning/SideBarWarning'
import { clsx } from 'clsx'
import { Button } from '@/shared/ui'
import { useAppSelector } from '@/shared/lib/hooks/hooks'
import { selectCurrentMessages } from '@/shared/api/appSlice'
import { TypeOfModalWindow } from '@/widgets/Sidebar/Sidebar'
import { FiltersPanel, ImageEditor, ImageUploader, PublishForm } from '@/shared/ui/Modal'
import {
  useCreatePostMutation,
  useDeletePostsImageMutation,
  useUploadPostsImagesMutation,
} from '@/features/posts/api/posts-api'
import { useMeQuery } from '@/features/auth/api/authApi'
import { useGetUserFollowingAndFollowersQuery } from '@/features/publicUserApi/publicUserApi'
import { Images } from '@/shared/lib/sсhemas/posts'
import { toast } from 'sonner'
import { AlertToast } from '@/shared/ui/Alerts/Alerts'
import { createTempFile } from '@/shared/ui/Modal/SuperModal/ImageEditor/model/TempFile'
import { filters, getFilterWithIntensity } from '@/shared/ui/Modal/SuperModal/constans/filters'
import { applyFilterToImage } from '@/shared/ui/Modal/model/utils'
import { useRouter } from 'next/navigation'

type Props = {
  title: string
  callback: (type: TypeOfModalWindow) => void
  userId: number | undefined
}

export type Step = 'upload' | 'edit' | 'filters' | 'publish' | 'noevents'

// Константы для лучшей читаемости
const MAX_IMAGES = 10
const DEFAULT_FILTER = { filter: 'normal', intensity: 100 }

export const SuperModal = ({ title, callback, userId }: Props) => {
  // === HOOKS ===
  const router = useRouter()
  const currentLanguageArray = useAppSelector(selectCurrentMessages)

  // === API MUTATIONS ===
  const [uploadImage, { data, isLoading }] = useUploadPostsImagesMutation()
  const [deletePosts] = useDeletePostsImageMutation()
  const [createPost] = useCreatePostMutation()

  // === API QUERIES ===
  const { data: userData } = useMeQuery()
  const { data: userProfile } = useGetUserFollowingAndFollowersQuery(
    { userName: userData?.userName || '' },
    { skip: !userData?.userName }
  )

  // === STATE ===
  const [currentStep, setCurrentStep] = useState<Step>('upload')
  const [exitModalIsOpen, setExitModalIsOpen] = useState(false)
  const [localFiles, setLocalFiles] = useState<File[]>([])
  const [uploadedImages, setUploadedImages] = useState<Images[]>([])
  const [selectedImage, setSelectedImage] = useState(0)
  const [imageFilters, setImageFilters] = useState<{
    [key: number]: { filter: string; intensity: number }
  }>({})
  const [publishFormData, setPublishFormData] = useState({
    description: '',
    location: '',
  })

  // === REFS ===
  const modalRef = useRef<HTMLDivElement>(null)
  const publishFormDataRef = useRef(publishFormData)

  // === EFFECTS ===
  useEffect(() => {
    router.replace(`/profile/${userId}?action=create`)
  }, [router, userId])

  useEffect(() => {
    publishFormDataRef.current = publishFormData
  }, [publishFormData])

  // === HANDLERS ===
  const handleImageUpload = (files: File[], step: Step = 'noevents') => {
    const filteredFiles = files.filter(
      newFile =>
        !localFiles.some(
          existingFile =>
            existingFile.name === newFile.name &&
            existingFile.size === newFile.size &&
            existingFile.lastModified === newFile.lastModified
        )
    )

    const newFiles = [...localFiles, ...filteredFiles]

    if (newFiles.length > MAX_IMAGES) {
      const remainingSlots = MAX_IMAGES - localFiles.length
      const errorMessage = `You can only add ${remainingSlots} more image(s)`
      toast.custom(() => (
        <AlertToast variant="error" title="Limit is reached" description={errorMessage} />
      ))
      setCurrentStep('upload')
      return
    }

    const tempImages = filteredFiles.map((file) => createTempFile(file))
    const tempUploadImages = [...uploadedImages, ...tempImages]

    setLocalFiles(newFiles)
    setUploadedImages(tempUploadImages)
    setSelectedImage(0)

    if (step !== 'noevents') {
      setCurrentStep(step)
      uploadImage(localFiles)
    }
  }

  const handleImageUpdateByCrop = useCallback(
    (index: number, updatedImage: Images, updatedFile?: File) => {
      setUploadedImages(prev => {
        const updated = [...prev]
        updated[index] = updatedImage
        return updated
      })

      if (updatedFile) {
        setLocalFiles(prev => {
          const updated = [...prev]
          updated[index] = updatedFile
          return updated
        })
      }
    },
    []
  )

  const handleDeletePosts = (postsId: string, index: number) => {
    const stateAfterDelete = uploadedImages.filter(image => image.uploadId !== postsId)
    const localFilesAfterDeleting = localFiles.filter((_, i) => i !== index)

    setUploadedImages(stateAfterDelete)
    setLocalFiles(localFilesAfterDeleting)

    if (stateAfterDelete.length === 0) {
      setCurrentStep('upload')
      setSelectedImage(0)
    }
  }

  const handleOpendraft = () => {
    setCurrentStep('edit')
  }

  const getCurrentFilter = () => imageFilters[selectedImage] || DEFAULT_FILTER

  const handleFilterSelect = (filter: string, intensity: number = 100) => {
    setImageFilters(prev => ({
      ...prev,
      [selectedImage]: { filter, intensity },
    }))
  }

  const handlePublishFormDataChange = (data: { description: string; location: string }) => {
    setPublishFormData(data)
    document.body.style.overflowY = ''
  }

  // === NAVIGATION ===
  const handleNext = () => {
    const stepMap: Record<Step, Step | undefined> = {
      upload: undefined,
      edit: 'filters',
      filters: 'publish',
      publish: undefined,
      noevents: undefined,
    }

    const nextStep = stepMap[currentStep]
    if (nextStep) setCurrentStep(nextStep)
  }

  const handleBack = () => {
    const stepMap: Record<Step, Step | undefined> = {
      upload: undefined,
      edit: 'upload',
      filters: 'edit',
      publish: 'filters',
      noevents: undefined,
    }

    const prevStep = stepMap[currentStep]
    if (prevStep) setCurrentStep(prevStep)
  }

  // === MODAL CONTROLS ===
  const handleOverlayClick = (event: MouseEvent<HTMLElement>) => {
    document.body.style.overflow = ''
    if (event.target === event.currentTarget) {
      setExitModalIsOpen(true)
    }
  }

  const handleCloseClick = (event: MouseEvent<HTMLButtonElement>): void => {
    document.body.style.overflow = ''
    callback(null)
    event.stopPropagation()

  }

  const handlerModalCloseWithSave = async () => {
    handleExitingModal()
    callback(null)
    await uploadImage(localFiles)
  }

  const handleExitingModal = () => {
    document.body.style.overflow = ''
    setExitModalIsOpen(false)
  }
  console.log(document.body.style.overflow)

  const handleDiscard = () => {
    setCurrentStep('upload')
    setLocalFiles([])
    setUploadedImages([])
    setExitModalIsOpen(false)
  }

  // === PUBLISH ===
  const handlePublish = async () => {
    try {
      if (localFiles.length === 0) {
        toast.error('No images to upload')
        return
      }

      const currentFormData = publishFormDataRef.current
      if (!currentFormData.description?.trim()) {
        toast.error('Please add a description')
        return
      }
      if (!currentFormData.location?.trim()) {
        toast.error('Please add a location')
        return
      }

      const processedFiles = await processImagesWithFilters()
      const uploadResult = await uploadImage(processedFiles).unwrap()

      if (!uploadResult?.images) {
        console.log('❌ Failed to upload images to server')
        return
      }

      await createPostWithData(currentFormData, uploadResult.images)

      callback(null)
      //здесь не было
      document.body.style.overflow = ''
      toast.success('Post published successfully!')
    } catch (err) {

      toast.error('Failed to publish post. Please try again.')
    }
  }

  // === HELPER FUNCTIONS ===
  const processImagesWithFilters = async (): Promise<File[]> => {
    const processedFiles: File[] = []

    for (let i = 0; i < localFiles.length; i++) {
      const file = localFiles[i]
      const filterConfig = imageFilters[i]

      if (filterConfig && filterConfig.filter !== 'normal') {
        const filter = filters.find(f => f.name === filterConfig.filter)
        const cssFilter = getFilterWithIntensity(
          filter?.cssFilter || 'none',
          filterConfig.intensity
        )
        const newFile = await applyFilterToImage(file, cssFilter)
        processedFiles.push(newFile)
      } else {
        processedFiles.push(file)
      }
    }

    return processedFiles
  }

  const createPostWithData = async (formData: typeof publishFormData, images: Images[]) => {
    const postData = {
      description: formData.description.trim(),
      location: formData.location.trim(),
      childrenMetadata: images.map(image => ({
        uploadId: image.uploadId,
      })),
      userId: userData?.userId,
    }

    await createPost(postData).unwrap()
  }

  // === RENDER HELPERS ===
  const getTitleForHeader = (): string => {
    const titles: Record<Step, string> = {
      upload: title,
      edit: 'Cropping',
      filters: 'Filters',
      publish: 'Publication',
      noevents: title,
    }

    return titles[currentStep]
  }

  const renderCurrentStep = () => {
    const stepComponents = {
      upload: (
        <ImageUploader
          handleOpenDraft={handleOpendraft}
          onUpload={handleImageUpload}
        />
      ),
      edit: (
        <ImageEditor
          deletePost={handleDeletePosts}
          onUpload={handleImageUpload}
          isLoading={isLoading}
          images={uploadedImages || []}
          selectedImage={selectedImage}
          onSelectImage={setSelectedImage}
          onImageUpdate={handleImageUpdateByCrop}
        />
      ),
      filters: (
        <FiltersPanel
          images={uploadedImages || []}
          selectedImage={selectedImage}
          onSelectImage={setSelectedImage}
          selectedFilter={getCurrentFilter().filter}
          filterIntensity={getCurrentFilter().intensity}
          onFilterSelect={handleFilterSelect}
        />
      ),
      publish: (
        <PublishForm
          images={uploadedImages || []}
          selectedImage={selectedImage}
          onSelectImage={setSelectedImage}
          appliedFilter={getCurrentFilter().filter}
          filterIntensity={getCurrentFilter().intensity}
          imageFilters={imageFilters}
          onFormDataChange={handlePublishFormDataChange}
          user={userData ? {
            userName: userData.userName,
            avatarUrl: userProfile?.avatars?.[0]?.url || null
          } : undefined}
        />
      ),
      noevents: null,
    }

    return stepComponents[currentStep]
  }

  // === RENDER ===
  return (
    <div className={s.overlay} onClick={handleOverlayClick}>
      <div className={s.modal} ref={modalRef}>
        <ModalHeader
          isLoading={isLoading}
          forwardClickAction={handleNext}
          uploadClickAction={handlePublish}
          backClickAction={handleBack}
          type={currentStep}
          title={getTitleForHeader()}
          onClickAction={handleCloseClick}
        />
        <div
          className={clsx(
            s.supermodalContent,
            currentStep === 'filters' && s.filtersStep,
            currentStep === 'publish' && s.publishStep
          )}
        >
          {renderCurrentStep()}
        </div>
      </div>

      {exitModalIsOpen && (
        <Modal title={currentLanguageArray.settings.close} onClick={handleExitingModal}>
          <SideBarWarning>
            {currentLanguageArray.modals.closeModalWarningBegin}
            <br />
            {currentLanguageArray.modals.closeModalwarningQSecondPart}
          </SideBarWarning>
          <div className={clsx(s.buttonWrapper, s.buttonWrapperforPhoto)}>
            <Button variant={'outline'} onClick={handleDiscard}>
              {currentLanguageArray.modals.discard}
            </Button>
            <Button onClick={handlerModalCloseWithSave}>
              {currentLanguageArray.settings.save}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}