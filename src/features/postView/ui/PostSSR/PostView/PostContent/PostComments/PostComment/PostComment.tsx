'use client'
import s from "./PostComment.module.scss";
import Avatar from "../../../../../../../../entities/user/ui/Avatar/Avatar";
import {Comment, LikeStatus} from "@/features/postView/api/types";
import {LikeButton} from "@/features/postView/ui/PostSSR/PostView/PostContent/LikeButton/LikeButton";
import {useMeQuery} from "@/features/auth/api/authApi";
import {
    CommentText
} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostComments/PostComment/CommentText/CommentText";
import {useUpdateCommentLikeStatusMutation} from "@/features/posts/api/posts-api";

type Props = {
    comment: Comment,
    postId: number
};

export const PostComment = ({comment, postId}: Props) => {

    const [updateCommentLikeStatus] = useUpdateCommentLikeStatusMutation()
    const {data: meUser} = useMeQuery()

    const likeHandler = () => {
        const newLikeStatus = comment.isLiked ? LikeStatus.NONE : LikeStatus.LIKE
        updateCommentLikeStatus({commentId: comment.id, postId, likeStatus: newLikeStatus})
    }

    return (
        <article className={s.comment}>
            <Avatar src={comment.from?.avatars[0]?.url} alt={'avatar'} size={"small"}/>
            <CommentText content={comment.content}
                         createdAt={comment.createdAt}
                         likeCount={comment.likeCount}
                         username={comment.from.username}
                         answerCount={comment.answerCount}/>
            <LikeButton isLiked={comment.isLiked} onClick={likeHandler} disabled={!meUser?.userId}/>
        </article>

    );
};