import s from './PostTitle.module.scss'
import { Avatar } from '@/entities/user/ui/Avatar'
import { useMeQuery } from '@/features/auth/api/authApi'
import DropdownPostActionsMenu from '@/features/postView/ui/PostSSR/PostView/PostContent/PostTitle/DropdownMenuDemo/DropdownPostActionsMenu'
import { useFetchUserQuery } from '@/features/publicUserApi/publicUserApi'

type Props = {
  ownerId: number
  firstName: string
  lastName: string
  postUserName: string
  postId: number
  onEdit?: () => void
  onCancel?: (hasChanges: boolean) => void
  deleteHandler: (value: boolean) => void
  isDeleteModalOpen: boolean
}
export const PostTitle = ({
  firstName,
  lastName,
  ownerId,
  postUserName,
  postId,
  onEdit,
  onCancel,
  deleteHandler,
  isDeleteModalOpen,
}: Props) => {
  const { data } = useMeQuery()
  const { data: user } = useFetchUserQuery(ownerId)

  //является ли текущий пользователь владельцем поста
  const isPostOwner = data?.userId === ownerId

  return (
    <div className={s.postTitle}>
      <div className={s.ownerInf}>
        <Avatar src={user?.avatars[0]?.url} alt={'avatar'} />
        <div className={s.ownerName}>
          {firstName && lastName ? firstName + ' ' + lastName : postUserName}
        </div>
      </div>
      {data?.userId && (
        <DropdownPostActionsMenu
          isPostOwner={isPostOwner}
          postId={postId}
          onEdit={onEdit}
          onCancel={onCancel}
          deleteHandler={deleteHandler}
          isDeleteModalOpen={isDeleteModalOpen}
        />
      )}
    </div>
  )
}
