import { useState } from 'react'
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
import { useUploadPostsImagesMutation } from '@/features/posts/api/posts-api'

type Props ={
  title: string,

  callback: (type:TypeOfModalWindow)=>void,
}
export type Step = 'upload' | 'edit' | 'filters' | 'publish';
export const SuperModal = ({title,callback}: Props) => {
const [uploadImage,{data}] = useUploadPostsImagesMutation()
  const currentLanguageArray = useAppSelector(selectCurrentMessages)

  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [exitModalIsOpen, setExitModalIsOpen] = useState(false)
  const [images, setImages] = useState<File[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const handleImageUpload = (files: File[]) => {
    setImages(files);
    //uploadImage(files)
    setCurrentStep('edit');
  };

  const handleNext = () => {
    switch (currentStep) {
      case 'edit':
        setCurrentStep('filters');
        break;
      case 'filters':
        setCurrentStep('publish');
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'edit':
        setCurrentStep('upload');
        break;
      case 'filters':
        setCurrentStep('edit');
        break;
      case 'publish':
        setCurrentStep('filters');
        break;
    }
  };
const handleModalCloseHandler = ()=>{
callback(null)
}
const handlerModalCloseWithSave = ()=>{
  //дописать логику сохранения изменений
  console.log('try to work,baby')
}
const handleExitingModal=()=>{
  setExitModalIsOpen(false)
}
const handleDiscard = ()=>{
  setCurrentStep('upload');
  setExitModalIsOpen(false)
}
const handlePublish=()=>{
  //логика отправик на серверд
  console.log('upload to server')
}
const titleForHeader = currentStep==='upload'?title:currentStep==='edit'?'Cropping':currentStep==='filters'?'Filters':'Publication'
  return(
    <div className={s.overlay} >
      <div className={s.modal} >
      <ModalHeader forwarfClick={handleNext} uploadClick={handlePublish} backClick={handleBack} type={currentStep} title={titleForHeader} onClick={handleModalCloseHandler}/>
        <div className={s.supermodalContent}>
          {currentStep === 'upload' && (
            <ImageUploader images={images} onUpload={handleImageUpload} />
          )}
          {currentStep === 'edit' && (
            <ImageEditor
            images={images}
              selectedImage={selectedImage}
              onSelectImage={setSelectedImage}
            />
          )}
          {currentStep === 'filters' && (
            <FiltersPanel
              /*image={images[selectedImage]}
              filters={filters}
              onFilterSelect={setFilters}*/
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
      {exitModalIsOpen&& (
        <Modal title={currentLanguageArray.settings.close} onClick={handleExitingModal}>
          <SideBarWarning>
            {currentLanguageArray.modals.closeModalWarningBegin}
            <br />
            {currentLanguageArray.modals.closeModalwarningQSecondPart}
          </SideBarWarning>
          <div className={clsx(s.buttonWrapper,s.buttonWrapperforPhoto)}>
            <Button variant={'outline'} onClick={handleDiscard}>
              {currentLanguageArray.modals.discard}
            </Button>
            <Button onClick={handlerModalCloseWithSave}>{currentLanguageArray.settings.save}</Button>
          </div>
        </Modal>
      )}
    </div>
  )
}