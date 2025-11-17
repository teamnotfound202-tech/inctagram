import s from './WhoLikesWrapper.module.scss'
import Avatar from '../../../entities/user/ui/Avatar/Avatar'
import { useAppSelector } from '@/shared/lib/hooks/hooks'
import { selectCurrentMessages } from '@/shared/api/appSlice'

type Props = {
  avatars: string[],
  likesCount: number,
}

const AVATARS_COUNT_TO_PREVIEW_LIKE_STANDART = 3

export const WhoLikesWrapper = ({avatars, likesCount}: Props) => {
  const currentLanguage = useAppSelector(selectCurrentMessages)

  const avatarsWhoLikesPost = avatars.slice(-AVATARS_COUNT_TO_PREVIEW_LIKE_STANDART)

  return (
    <div className={s.avatarsWhoLikesWrapper}>
      {avatarsWhoLikesPost?.map((avatar, index) => (
        <div key={avatar+index.toString()} className={s.avatars}>
          <Avatar src={avatar} alt={'avatarsWhoLikes'} size={'very_small'}/>
        </div>
      ))}
      <div className={s.likesCount}>{likesCount} &#34;{currentLanguage.posts.like}&#34;</div>
    </div>
  )
}