'use client'
import s from "./PostComment.module.scss";
import Avatar from "../../../../../../../../entities/user/ui/Avatar/Avatar";
import Heart from "@/features/postView/ui/PostSSR/PostView/Icons/littleLike/heart.svg";
import DisLike from "@/features/postView/ui/PostSSR/PostView/Icons/littleLike/DisLike.svg";
import {Comment, LikeStatus} from "@/features/postView/api/types";
import {getTimeDifference} from "@/shared/lib/utils/getTimeDifference";
import {useAppSelector} from "@/shared/lib/hooks/hooks";
import {selectCurrentMessages} from "@/shared/api/appSlice";
import {useUpdateCommentLikeStatusMutation} from "@/features/postView/api/postApi";
import {LikeButton} from "@/features/postView/ui/PostSSR/PostView/PostContent/LikeButton/LikeButton";

type Props = {
    comment: Comment,
    postId:number
};

export const PostComment = ({comment, postId}: Props) => {
    const currentLanguage = useAppSelector(selectCurrentMessages)
    const [updateCommentLikeStatus] = useUpdateCommentLikeStatusMutation()

    const likeHandler = () => {
        const newLikeStatus = comment.isLiked? LikeStatus.NONE : LikeStatus.LIKE
        updateCommentLikeStatus({commentId: comment.id, postId, likeStatus: newLikeStatus})
    }

    const commentCreationTime = getTimeDifference(comment.createdAt)

    return (
        <article className={s.comment}>
            <Avatar src={comment.from?.avatars[0]?.url} alt={'avatar'} size={"small"}/>
            <div className={s.postText}>
                <span className={s.commentAuthorName}>{comment.from.username}  </span>
                <p className={s.commentDescription}>{comment.content}</p>
                <div className={s.commentMeta}>
                    <div className={s.commentCreationTime}>{commentCreationTime}</div>
                    {comment.likeCount && <div className={s.likesCount}>Like: {comment.likeCount}</div>}
                    <span
                        className={s.answerLink}>{currentLanguage.posts.answer}</span> {/*TODO: добавить слова в словарь*/}
                    <div className={s.commentAnswer}> answerCount {comment.answerCount}</div>
                    {/*TODO доделать открытие ответов комментариев*/}
                </div>
            </div>
            <LikeButton isLiked={comment.isLiked} onClick={likeHandler}/>
        </article>

    );
};