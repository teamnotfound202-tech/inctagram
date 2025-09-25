import { useRef, useState } from 'react'
import s from '../Modal.module.scss'
import { ModalHeader } from '@/shared/ui/Modal/SuperModal/ModalHeader/ModalHeader'
import { Modal } from '@/shared/ui/Modal/Modal'
import { SideBarWarning } from '@/shared/ui/Modal/SideBarWarning/SideBarWarning'
import { Button } from '@/shared/ui'
import { useAppSelector } from '@/shared/lib/hooks/hooks'
import { selectCurrentMessages } from '@/shared/api/appSlice'
import { TypeOfModalWindow } from '@/widgets/Sidebar/Sidebar'
import { FiltersPanel, ImageEditor, ImageUploader, PublishForm } from '@/shared/ui/Modal'
import { useUploadPostsImagesMutation } from '@/features/posts/api/posts-api'
import { MouseEvent } from 'react'
import { Image } from '@/shared/lib/sсhemas/posts'
import { toast } from 'sonner'
import { AlertToast } from '@/shared/ui/Alerts/Alerts'

type Props = {
  title: string
  callback: (type: TypeOfModalWindow) => void
}
export type Step = 'upload' | 'edit' | 'filters' | 'publish'
export const SuperModal = ({ title, callback }: Props) => {
  const [uploadImage, { data, isLoading }] = useUploadPostsImagesMutation()
  const currentLanguageArray = useAppSelector(selectCurrentMessages)

  const [currentStep, setCurrentStep] = useState<Step>('upload')
  const [exitModalIsOpen, setExitModalIsOpen] = useState(false)
  const [localFiles, setLocalFiles] = useState<File[]>([])
  const [uploadedImages, setUploadedImages] = useState<Image[]>([])
  const [selectedImage, setSelectedImage] = useState(0)
  const modalRef = useRef<HTMLDivElement>(null)
  const handleImageUpload = async (files: File[]) => {
    setCurrentStep('edit')
    setSelectedImage(0)
    const newFiles = [...localFiles, ...files]
       if (newFiles.length > 10) {
      const remainingSlots = 10 - localFiles.length
      const errorMessage = `You can add only add ${remainingSlots} more image(s)`
      toast.custom(() => (
        <AlertToast variant="error" title="Limit is reached" description={errorMessage} />
      ))
      setCurrentStep('upload')
      return
    }
    try {

      setLocalFiles(newFiles)


      const result = await uploadImage(newFiles).unwrap()
      setUploadedImages(result.images)
    } catch (error) {
      setSelectedImage(0)
      setCurrentStep('upload')

      setLocalFiles(localFiles) // Возвращаем предыдущее значение
    }
  }

  const handleOpendraft = () => {
    setCurrentStep('edit')
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

  const handlerModalCloseWithSave = () => {
    //дописать логику сохранения изменений
    console.log('try to work,baby')
  }
  const handleExitingModal = () => {
    setExitModalIsOpen(false)
  }
  const handleDiscard = () => {
    setCurrentStep('upload')
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
              onUpload={handleImageUpload}
              isLoading={isLoading}
              images={uploadedImages || []}
              selectedImage={selectedImage}
              onSelectImage={setSelectedImage}
            />
          )}
          {currentStep === 'filters' && (
            <FiltersPanel
            images={uploadedImages || []}

            />
          )}
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
