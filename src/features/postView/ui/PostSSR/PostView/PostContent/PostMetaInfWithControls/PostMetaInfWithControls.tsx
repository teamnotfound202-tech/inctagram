import s from "./PostMetaInfWithControls.module.scss";
import PaperPlane from "@/features/postView/ui/PostSSR/PostView/Icons/paper-plane-outline.svg";
import Bookmark from "@/features/postView/ui/PostSSR/PostView/Icons/Bookmark.svg";
import Avatar from "../../../../../../../entities/user/ui/Avatar/Avatar";
import {timeToTimeZone} from "@/shared/lib/utils/timeToTimeZone";
import {useAppSelector} from "@/shared/lib/hooks/hooks";
import {selectCurrentMessages} from "@/shared/api/appSlice";
import {LikeButton} from "@/features/postView/ui/PostSSR/PostView/PostContent/LikeButton/LikeButton";
import {useFetchUsersProfileQuery, useUpdatePostLikeStatusMutation} from "@/features/postView/api/postApi";
import {LikeStatus} from "@/features/postView/api/types";
import BigRedLike from "@/features/postView/ui/PostSSR/PostView/Icons/bigLike/bigRedLike.svg"
import Like from "@/features/postView/ui/PostSSR/PostView/Icons/bigLike/Like.svg"

type Props = {
    id: number,
    avatars: string[],
    likesCount: number,
    updatedAt: string,
    isLiked: boolean
};

export const PostMetaInfWithControls = ({avatars, likesCount, updatedAt, isLiked, id}: Props) => {
    const currentLanguage = useAppSelector(selectCurrentMessages)
    const postUpdateTime = timeToTimeZone(updatedAt)
    const [updatePostLikeStatus] = useUpdatePostLikeStatusMutation()
    const {data: meUser, isLoading} = useFetchUsersProfileQuery()

    const likeHandler = () => {
        const newLikeStatus = isLiked ? LikeStatus.NONE : LikeStatus.LIKE
        updatePostLikeStatus({postId: id, likeStatus: newLikeStatus})
    }

    return (
        <div className={s.postMetaInf}>
            //TODO: деструктуризация - вынести контролы
            {meUser?.id && <div className={s.controls}>
                <button className={s.likeButton} onClick={likeHandler}>
                    {isLiked ? <BigRedLike/> : <Like/>}
                </button>
                <button className={s.likeButton}>
                    <PaperPlane/>
                </button>
                <button className={s.likeButton + ' ' + s.leftControl}>
                    <Bookmark/>
                </button>
            </div>}
            <div className={s.avatarsWhoLikes}>
                <Avatar src={avatars[0]} alt={'avatarsWhoLikes'}
                        size={'very_small'}/> {/*TODO: добавить перебор аватаров*/}
                <div className={s.likesCount}>{likesCount} &#34;{currentLanguage.posts.like}&#34;</div>
            </div>
            <div className={s.postCreationTime}>{postUpdateTime}</div>
        </div>
    );
};