'use client'
import s from '@/shared/ui/Modal/Modal.module.scss'
import CloseBtnIcon from '@/shared/ui/Modal/icons/close.svg'
import { Step } from '@/shared/ui/Modal/SuperModal/SuperModal'
import BackArrowIcon from '@/shared/ui/Modal/icons/backArrow.svg'
import { Button } from '@/shared/ui'
import { MouseEvent } from 'react'
import { clsx } from 'clsx'
type ModalProps = {
  title: string
  onClickAction: (event: MouseEvent<HTMLButtonElement>) => void
  forwardClickAction: () => void
  backClickAction: () => void
  type: Step
  uploadClickAction: () => void
  isLoading: boolean
}

export const ModalHeader = ({
  title,
  onClickAction,
  backClickAction,
  type,
  forwardClickAction,
  uploadClickAction,
  isLoading
}: ModalProps) => {

  return (
    <div className={s.modalTop}>
      {type !== 'upload' && (
        <button className={clsx(s.modalCloseBtn,{
          [s.isLoading]: isLoading,
        })} onClick={backClickAction}>
          <BackArrowIcon className={s.closeBtnIcon} />
        </button>
      )}
      <h3 className={s.modalTitle}>{title}</h3>
      {type === 'upload' ? (
        <button className={s.modalCloseBtn} onClick={onClickAction}>
          <CloseBtnIcon className={s.closeBtnIcon} />
        </button>
      ) : (
        <Button
          disabled={isLoading}
          onClick={type === 'publish' ? uploadClickAction : forwardClickAction}
          variant={'text'}
          className={s.photoEditingNextBtn}
        >
          {type === 'publish' ? 'Publish' : 'Next'}
        </Button>
      )}
    </div>
  )
}
