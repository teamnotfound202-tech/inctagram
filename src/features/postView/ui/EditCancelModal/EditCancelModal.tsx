import { Modal } from '@/shared/ui/Modal/Modal'
import { Button } from '@/shared/ui/Button/Button'
import s from './EditCancelModal.module.scss'

type Props = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export const EditCancelModal = ({ isOpen, onClose, onConfirm }: Props) => {
  if (!isOpen) return null

  return (
    <Modal title="Завершить редактирование?" onClick={onClose}>
      <div className={s.content}>
        <p className={s.message}>
          Do you really want to finish editing? If you close the changes you have made will not be saved
        </p>
        <div className={s.actions}>
          <Button
            variant="outline"
            onClick={onClose}
            className={s.cancelButton}
          >
            No
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            className={s.confirmButton}
          >
            Yes
          </Button>
        </div>
      </div>
    </Modal>
  )
}