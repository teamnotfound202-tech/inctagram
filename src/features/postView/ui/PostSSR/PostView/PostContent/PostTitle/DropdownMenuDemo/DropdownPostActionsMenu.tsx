import * as React from "react";
import {DropdownMenu} from "radix-ui";
import Bucket from "../../../Icons/Bucket.svg"
import Copy from "../../../Icons/copy.svg"
import Edit from "../../../Icons/edit-2-outline.svg"
import Unfollow from "../../../Icons/person-remove-outline.svg"
import s from "./DropdownPostActionsMenu.module.scss";
import DotsHorizontalIcon from "@/features/postView/ui/PostSSR/PostView/Icons/DotsHorizontal.svg";
import {useAppSelector} from "@/shared/lib/hooks/hooks";
import {selectCurrentMessages} from "@/shared/api/appSlice";
import { useState } from 'react'
import { DeletePostModal } from '@/features/postView/ui/DeletePostModal/DeletePostModal'
import { CloseIcon } from '@/shared/ui/Alerts/CloseIcon/CloseIcon'
import { Button } from '@/shared/ui'

type Props = {
    isPostOwner: boolean;
    postId: number
    onEdit?: () => void
  onCancel?: (hasChanges: boolean) => void

}


const DropdownPostActionsMenu = ({isPostOwner, postId, onEdit, onCancel }: Props) => {
    const currentLanguage = useAppSelector(selectCurrentMessages)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    const editHandler = () => {
      if (onEdit) {
        onEdit()
    }}
    const deleteHandler = () => {
        setIsDeleteModalOpen(true)
    }
    const unfollowHandler = () => {
    }
    const copyLinkHandler = () => {
    }

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false)
    }


    return (
      <>
          <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
              <button className={s.IconButton} aria-label="Customise options">
                 <DotsHorizontalIcon/>
              </button>


          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
              <DropdownMenu.Content className={s.Content} align={'end'} alignOffset={0}>
                  {isPostOwner && <>
                      <DropdownMenu.Item className={s.Item} onClick={editHandler}>
                          <div><Edit/></div>
                          {currentLanguage.posts.dropdownMenu.editPost}
                      </DropdownMenu.Item>
                      <DropdownMenu.Item className={s.Item} onClick={deleteHandler}>
                          <div><Bucket/></div>
                          {currentLanguage.posts.dropdownMenu.deletePost}
                      </DropdownMenu.Item>
                  </>}

                  {!isPostOwner && <>
                      <DropdownMenu.Item className={s.Item} onClick={unfollowHandler}>
                          <div><Unfollow/></div>
                          {currentLanguage.posts.dropdownMenu.unfollow}
                      </DropdownMenu.Item>
                      <DropdownMenu.Item className={s.Item} onClick={copyLinkHandler}>
                          <div><Copy/></div>
                          {currentLanguage.posts.dropdownMenu.copyLink} {/*TODO: fix-при перезагрузке страницы язык сбрасывается, нужно сохранять его в localStorage*/}
                      </DropdownMenu.Item>
                  </>}
              </DropdownMenu.Content>
          </DropdownMenu.Portal>
      </DropdownMenu.Root>
          <DeletePostModal
            postId={postId}
            isOpen={isDeleteModalOpen}
            onClose={handleCloseDeleteModal}
          />

      </>

    );
};

export default DropdownPostActionsMenu;
