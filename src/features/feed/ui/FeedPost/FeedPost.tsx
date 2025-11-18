import Avatar from '../../../../entities/user/ui/Avatar/Avatar'
import { LinkContent } from '@/views/ProfilePosts/PostItem/LinkContent/LinkContent'
import LikeIcon from './icons/like.svg'
import MessageIcon from './icons/message.svg'
import AirIcon from './icons/air.svg'
import BigLikeIcon from './icons/big-like.svg'
import ThreedotIcon from './icons/threedot.svg'
import FavoritesIcon from './icons/favorites.svg'
import { LikeStatus, Post } from '@/features/publicUserApi/types'
import { getTimeDifference } from '@/shared/lib/utils/getTimeDifference'
import { useAppSelector } from '@/shared/lib/hooks/hooks'
import { selectCurrentMessages, selectLanguage } from '@/shared/api/appSlice'
import s from './FeedPost.module.scss'
import {
  PostDescriptionAsComment
} from '@/features/postView/ui/PostSSR/PostView/PostContent/PostComments/PostDescriptionAsComment/PostDescriptionAsComment'
import Link from 'next/link'
import { useUpdatePostLikeStatusMutation } from '@/features/posts/api/posts-api'
import { useMeQuery, useMyProfileQuery } from '@/features/auth/api/authApi'
import { WhoLikesWrapper } from '@/shared/ui/WhoLikesWrapper/WhoLikesWrapper'
import { useFetchInfinityPostCommentsInfiniteQuery } from '@/features/comments/api/comments-api'
import { AddCommentForm } from '@/features/postView/ui/PostSSR/PostView/PostContent/AddCommentForm/AddCommentForm'
import { useState } from 'react'
import { FeedPopUp } from '@/features/feed/ui/FeedPopUp/FeedPopUp'
import clx from 'classnames'

type Props = {
  post: Post
}

export const FeedPost = ({post}: Props) => {
  const currentLanguage = useAppSelector(selectLanguage)
  const messages = useAppSelector(selectCurrentMessages)
  const [updatePostLikeStatus] = useUpdatePostLikeStatusMutation()
  const { data: commentsData } = useFetchInfinityPostCommentsInfiniteQuery({ postId: post.id })
  const {data: userData, isLoading} = useMyProfileQuery()
  const [isPopUpOpen, setIsPopUpOpen] = useState(false)

  const likeHandler = () => {
    const newLikeStatus = post.isLiked ? LikeStatus.NONE : LikeStatus.LIKE
    updatePostLikeStatus({postId: post.id, likeStatus: newLikeStatus, url: userData?.avatars[0].url || ''})
  }
  const totalCount = commentsData ? commentsData.pages[0].totalCount : 0
  return (
    <div className={s.feedPost}>
      <div className={s.userFeedPostTop}>
        <div className={s.userAvatarWrapper}>
          <Avatar src={post.avatarOwner} alt={'avatar'} size={'small'}/>
          <span className={s.userName}>{post.userName}</span>
          <div className={s.userNameDot}></div>
          <span>{getTimeDifference(post.createdAt, currentLanguage)}</span>
        </div>
        <button className={clx(s.feedBtn, {
          [s.btnPopUpActive]: isPopUpOpen
        })} onClick={() => setIsPopUpOpen((pervState) => !pervState)}>
          <ThreedotIcon/>
        </button>
        {isPopUpOpen && <FeedPopUp userName={post.userName} userId={post.ownerId}/>}
      </div>

      <Link className={s.feedImage} href={`/profile/${post.ownerId}/post/${post.id}`}>
        <LinkContent post={post}/>
      </Link>

      <div className={s.btnWrapper}>
        <div className={s.btnWrapperGroup}>
          <button className={s.btn} onClick={likeHandler}>
            {post.isLiked ? <BigLikeIcon/> : <LikeIcon/>}
          </button>
          <Link className={s.btn} href={`/profile/${post.ownerId}/post/${post.id}`}><MessageIcon/></Link>
          <button><AirIcon/></button>
        </div>
        <div>
          <button>
            <FavoritesIcon/>
          </button>
        </div>
      </div>

      <div className={s.counterLikesWrapper}>
        <PostDescriptionAsComment authorName={post.userName} postContent={post.description} descriptionCreationTime={''} ownerId={post.ownerId} postUserName={post.userName}/>
        <WhoLikesWrapper avatars={post.avatarWhoLikes} likesCount={post.likesCount}/>
      </div>

      <Link className={s.btn} href={`/profile/${post.ownerId}/post/${post.id}`}>{messages.posts.viewAllComments} ({totalCount})</Link>

      {!isLoading && userData && (
        <AddCommentForm
          postId={post.id}
          user={{
            id: userData.id,
            username: userData.userName,
            avatars: [...userData.avatars],
          }}
        />
      )}
    </div>
  )
}