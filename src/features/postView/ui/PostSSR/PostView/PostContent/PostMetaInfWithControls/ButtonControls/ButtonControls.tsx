import s
    from "./ButtonControls.module.scss";
import BigRedLike from "@/features/postView/ui/PostSSR/PostView/Icons/bigLike/bigRedLike.svg";
import Like from "@/features/postView/ui/PostSSR/PostView/Icons/bigLike/Like.svg";
import PaperPlane from "@/features/postView/ui/PostSSR/PostView/Icons/paper-plane-outline.svg";
import Bookmark from "@/features/postView/ui/PostSSR/PostView/Icons/Bookmark.svg";
import {useUpdatePostLikeStatusMutation} from "@/features/posts/api/posts-api";
import {LikeStatus} from "@/features/publicUserApi/types";
import { useMyProfileQuery } from '@/features/auth/api/authApi'

type Props = {
    isLiked:boolean
    postId: number

};
export const ButtonControls = ({isLiked,postId}: Props) => {
  const [updatePostLikeStatus] = useUpdatePostLikeStatusMutation()
  const{data}=useMyProfileQuery()

    const likeHandler = () => {
        const newLikeStatus = isLiked ? LikeStatus.NONE : LikeStatus.LIKE
        updatePostLikeStatus({postId, likeStatus: newLikeStatus, url: data?.avatars[0].url||'' })
    }

    return (
      <div className={s.controls}>
            <button className={s.likeButton} onClick={likeHandler}>
                {isLiked ? <BigRedLike/> : <Like/>}
            </button>
            <button className={s.likeButton}>
                <PaperPlane/>
            </button>
            <button className={s.likeButton + ' ' + s.leftControl}>
                <Bookmark/>
            </button>
        </div>
    );
};