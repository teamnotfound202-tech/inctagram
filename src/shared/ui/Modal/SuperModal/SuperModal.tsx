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
  useDeletePostsImageMutation,
  useUploadPostsImagesMutation,
  useCreatePostMutation,
} from '@/features/posts/api/posts-api'
import { Images } from '@/shared/lib/sсhemas/posts'
import { toast } from 'sonner'
import { AlertToast } from '@/shared/ui/Alerts/Alerts'
import { createTempFile } from '@/shared/ui/Modal/SuperModal/ImageEditor/model/TempFile'
import { filters, getFilterWithIntensity } from '@/shared/ui/Modal/SuperModal/constans/filters'
import { applyFilterToImage } from '@/shared/ui/Modal/model/utils'

type Props = {
  title: string
  callback: (type: TypeOfModalWindow) => void
}
export type Step = 'upload' | 'edit' | 'filters' | 'publish' | 'noevents'
export const SuperModal = ({ title, callback }: Props) => {
  const [uploadImage, { data, isLoading }] = useUploadPostsImagesMutation()
  const [deletePosts] = useDeletePostsImageMutation()
  const [createPost] = useCreatePostMutation()
  const currentLanguageArray = useAppSelector(selectCurrentMessages)
  const [currentStep, setCurrentStep] = useState<Step>('upload')
  const [exitModalIsOpen, setExitModalIsOpen] = useState(false)
  const [localFiles, setLocalFiles] = useState<File[]>([])
  const [uploadedImages, setUploadedImages] = useState<Images[]>([])
  const [selectedImage, setSelectedImage] = useState(0)
  const modalRef = useRef<HTMLDivElement>(null)

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

    if (newFiles.length > 10) {
      const remainingSlots = 10 - localFiles.length
      const errorMessage = `You can add only add ${remainingSlots} more image(s)`
      toast.custom(() => (
        <AlertToast variant="error" title="Limit is reached" description={errorMessage} />
      ))
      setCurrentStep('upload')
      return
    }

    // Создаем временные объекты изображений для локального использования
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
    const localFilesAfterDeleting = localFiles.filter((file, i) => i !== index)
    setUploadedImages(stateAfterDelete)
    setLocalFiles(localFilesAfterDeleting)
    if (stateAfterDelete.length === 0) {
      setCurrentStep('upload')
      setSelectedImage(0)
    }
    //deletePosts({ uploadId: postsId })
  }

  const handleOpendraft = async () => {
   /* const storedImages = localStorage.getItem(SAVED_IMAGES)
    if (!storedImages) return []
    const images = JSON.parse(storedImages)
    loadFilesFromUrls(images).then(files => {
      if (files.length > 0) {
        const tempImages = files.map(
          (file, index) => createTempFile(file, images[index]?.url) // Сохраняем originalUrl
        )
        setLocalFiles(files)
        setUploadedImages(tempImages)
        setCurrentStep('edit')
      }
    })*/
    setCurrentStep('edit')
  }

  //== Добавил состояния (Женя)
  //состояние для фильтров каждого изображения
  const [imageFilters, setImageFilters] = useState<{
    [key: number]: { filter: string; intensity: number }
  }>({})

  // Состояние для данных формы публикации
  const [publishFormData, setPublishFormData] = useState({
    description: '',
    location: '',
  })

  // Используем ref для хранения актуальных данных
  const publishFormDataRef = useRef(publishFormData)

  // Обновляем ref при изменении состояния
  useEffect(() => {
    publishFormDataRef.current = publishFormData
  }, [publishFormData])

  // Получаем текущий фильтр для выбранного изображения
  const getCurrentFilter = () => imageFilters[selectedImage] || { filter: 'normal', intensity: 100 }

  // Функция handleFilterSelect для обработки выбора фильтров (Женя)
  const handleFilterSelect = (filter: string, intensity: number = 100) => {
    setImageFilters(prev => ({
      ...prev,
      [selectedImage]: { filter, intensity },
    }))
  }

  // Обработчик изменений в форме публикации
  const handlePublishFormDataChange = (data: { description: string; location: string }) => {
    setPublishFormData(data)
  }

  const handleNext = () => {
    switch (currentStep) {
      case 'edit':
        setCurrentStep('filters')
        break
      case 'filters':
        setCurrentStep('publish')
        break
    }
  }

  const handleBack = () => {
    switch (currentStep) {
      case 'edit':
        setCurrentStep('upload')
        break
      case 'filters':
        setCurrentStep('edit')
        break
      case 'publish':
        setCurrentStep('filters')
        break
    }
  }

  const handleOverlayClick = (event: MouseEvent<HTMLElement>) => {
    if (event.target === event.currentTarget) {
      setExitModalIsOpen(true)
    }
  }

  // Обработчик для кнопки закрытия
  const handleCloseClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation() // Останавливаем всплытие
    callback(null)
  }

  const handlerModalCloseWithSave = async () => {
    handleExitingModal()
    await uploadImage(localFiles).finally(() => callback(null))
  }

  const handleExitingModal = () => {
    setExitModalIsOpen(false)
  }

  const handleDiscard = () => {
    setCurrentStep('upload')
    setLocalFiles([])
    setUploadedImages([])
    setExitModalIsOpen(false)
  }

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

      // ✅ применяем фильтры к каждому изображению
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

      // 🔥 Теперь загружаем уже обработанные изображения
      const uploadResult = await uploadImage(processedFiles).unwrap()

      if (!uploadResult || !uploadResult.images) {
        console.error('❌ Failed to upload images to server')
      }

      const postData = {
        description: currentFormData.description.trim(),
        location: currentFormData.location.trim(),
        childrenMetadata: uploadResult.images.map(image => ({
          uploadId: image.uploadId,
        })),
      }

      await createPost(postData).unwrap()

      callback(null)
      toast.success('Post published successfully!')
    } catch (err) {
      console.error('❌ Error publishing post:', err)
      toast.error('Failed to publish post. Please try again.')
    }
  }
    const titleForHeader =
      currentStep === 'upload'
        ? title
        : currentStep === 'edit'
        ? 'Cropping'
        : currentStep === 'filters'
        ? 'Filters'
        : 'Publication'

    //добавил стили в дивку ниже когда currentStep === 'filters' или 'publish'
    // тогда s.filtersStep или s.publishStep (Женя)
    return (
      <div className={s.overlay} onClick={handleOverlayClick}>
        <div className={s.modal} ref={modalRef}>
          <ModalHeader
            isLoading={isLoading}
            forwardClickAction={handleNext}
            uploadClickAction={handlePublish}
            backClickAction={handleBack}
            type={currentStep}
            title={titleForHeader}
            onClickAction={handleCloseClick}
          />
          <div
            className={clsx(
              s.supermodalContent,
              currentStep === 'filters' && s.filtersStep,
              currentStep === 'publish' && s.publishStep
            )}
          >
            {currentStep === 'upload' && (
              <ImageUploader handleOpenDraft={handleOpendraft} onUpload={handleImageUpload} />
            )}

            {currentStep === 'edit' && (
              <ImageEditor
                deletePost={handleDeletePosts}
                onUpload={handleImageUpload}
                isLoading={isLoading}
                images={uploadedImages || []}
                selectedImage={selectedImage}
                onSelectImage={setSelectedImage}
                onImageUpdate={handleImageUpdateByCrop}
              />
            )}
            {currentStep === 'filters' && (
              <FiltersPanel
                images={uploadedImages || []}
                selectedImage={selectedImage}
                onSelectImage={setSelectedImage}
                selectedFilter={getCurrentFilter().filter}
                filterIntensity={getCurrentFilter().intensity}
                onFilterSelect={handleFilterSelect}
              />
            )}
            {currentStep === 'publish' && (
              <PublishForm
                images={uploadedImages || []}
                selectedImage={selectedImage}
                onSelectImage={setSelectedImage}
                appliedFilter={getCurrentFilter().filter}
                filterIntensity={getCurrentFilter().intensity}
                imageFilters={imageFilters}
                onFormDataChange={handlePublishFormDataChange}
              />
            )}
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
