import { useCallback, useEffect, useRef, useState } from 'react'
import s from '../Modal.module.scss'
import { ModalHeader } from '@/shared/ui/Modal/SuperModal/ModalHeader/ModalHeader'
import { Modal } from '@/shared/ui/Modal/Modal'
import { SideBarWarning } from '@/shared/ui/Modal/SideBarWarning/SideBarWarning'
import { Button } from '@/shared/ui'
import { useAppSelector } from '@/shared/lib/hooks/hooks'
import { selectCurrentMessages } from '@/shared/api/appSlice'
import { TypeOfModalWindow } from '@/widgets/Sidebar/Sidebar'
import { FiltersPanel, ImageEditor, ImageUploader, PublishForm } from '@/shared/ui/Modal'
import {
  useDeletePostsImageMutation,
  useUploadPostsImagesMutation,
} from '@/features/posts/api/posts-api'
import { MouseEvent } from 'react'
import { Image } from '@/shared/lib/sсhemas/posts'
import { toast } from 'sonner'
import { AlertToast } from '@/shared/ui/Alerts/Alerts'
import {SAVED_IMAGES} from "@/shared/lib/constants/constants";
import {createTempFile} from "@/shared/ui/Modal/SuperModal/ImageEditor/model/TempFile";

type Props = {
  title: string
  callback: (type: TypeOfModalWindow) => void
}
export type Step = 'upload' | 'edit' | 'filters' | 'publish' | 'noevents'
export const SuperModal = ({ title, callback }: Props) => {
  const [uploadImage, { data, isLoading }] = useUploadPostsImagesMutation()
  const [deletePosts] = useDeletePostsImageMutation()
  const currentLanguageArray = useAppSelector(selectCurrentMessages)
  const [currentStep, setCurrentStep] = useState<Step>('upload')

  const [exitModalIsOpen, setExitModalIsOpen] = useState(false)
  const [localFiles, setLocalFiles] = useState<File[]>([])
  const [uploadedImages, setUploadedImages] = useState<Image[]>([])
  const [selectedImage, setSelectedImage] = useState(0)
  const modalRef = useRef<HTMLDivElement>(null)

  const handleImageUpload = (files: File[], step: Step = 'noevents') => {
    const filteredFiles = files.filter(newFile =>
      !localFiles.some(existingFile =>
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
    const tempImages = filteredFiles.map((file, index) => (createTempFile(file)))
    const tempUploadImages = [...uploadedImages, ...tempImages]
    setLocalFiles(newFiles)
    setUploadedImages(tempUploadImages)
    setSelectedImage(0)
    if (step !== 'noevents') {
      setCurrentStep(step)
      uploadImage(localFiles)
    }
  }

  const handleImageUpdateByCrop = useCallback((index: number, updatedImage: Image, updatedFile?: File) => {
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
  }, [])

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

  const handleOpendraft = () => {
const storedImages = localStorage.getItem(SAVED_IMAGES)
    if(!storedImages) return []
    const images = JSON.parse(storedImages)
    console.log(images)
    //setCurrentStep('edit')
    }

  const handleNext = () => {
    switch (currentStep) {
      case 'edit':
        handleImageUpload(localFiles, 'filters')
        break
      case 'filters':
        handleImageUpload(localFiles, 'publish')
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
    localStorage.setItem(SAVED_IMAGES, JSON.stringify(uploadedImages))
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

  const handlePublish = () => {
    //логика отправик на серверд
    console.log('upload to server')
  }

  const titleForHeader =
    currentStep === 'upload'
      ? title
      : currentStep === 'edit'
        ? 'Cropping'
        : currentStep === 'filters'
          ? 'Filters'
          : 'Publication'

  return (
    <div className={s.overlay} onClick={handleOverlayClick}>
      <div className={s.modal} ref={modalRef}>
        <ModalHeader
          isLoading={isLoading}
          forwarfClick={handleNext}
          uploadClick={handlePublish}
          backClick={handleBack}
          type={currentStep}
          title={titleForHeader}
          onClick={handleCloseClick}
        />
        <div className={s.supermodalContent}>
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
          {currentStep === 'filters' && <FiltersPanel images={uploadedImages || []} />}
          {currentStep === 'publish' && (
            <PublishForm
              /*images={images}
                            filters={filters}
                            onPublish={() => {/!* API call *!/}}*/
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
          <div className={s.buttonWrapper}>
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