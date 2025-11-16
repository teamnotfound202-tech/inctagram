'use client'
import s from "./PostComment.module.scss";
import Avatar from "../../../../../../../../entities/user/ui/Avatar/Avatar";
import {LikeButton} from "@/features/postView/ui/PostSSR/PostView/PostContent/LikeButton/LikeButton";
import {useMeQuery} from "@/features/auth/api/authApi";
import {
    CommentText
} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostComments/PostComment/CommentText/CommentText";
import {useUpdateCommentLikeStatusMutation} from "@/features/comments/api/comments-api";
import {Comment, LikeStatus} from "@/features/publicUserApi/types";
import {useState} from "react";
import {PostAnswers} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostComments/PostAnswers/PostAnswers";

type Props = {
    comment: Comment,
    postId: number
};

export const PostComment = ({comment, postId}: Props) => {

    const [updateCommentLikeStatus] = useUpdateCommentLikeStatusMutation()
    const {data: meUser} = useMeQuery()

    const [isAnswersOpened, setIsAnswersOpened] = useState(false)

    const likeHandler = () => {
        const newLikeStatus = comment.isLiked ? LikeStatus.NONE : LikeStatus.LIKE
        updateCommentLikeStatus({commentId: comment.id, postId, likeStatus: newLikeStatus})
    }

    return (
        <>
            <article className={s.comment}>
                <Avatar src={comment.from?.avatars[0]?.url} alt={'avatar'} size={"small"}/>
                <CommentText content={comment.content}
                             createdAt={comment.createdAt}
                             likeCount={comment.likeCount}
                             username={comment.from.username}
                             answerCount={comment.answerCount}
                             comment={comment}
                             isAnswersOpened={isAnswersOpened}
                             setIsAnswersOpened={setIsAnswersOpened}/>
                <LikeButton isLiked={comment.isLiked} onClick={likeHandler}
                            disabled={!meUser?.userId}/> {/*TODO: проверить дизейбл кнопок, если не залогинен*/}
            </article>

            {isAnswersOpened && <PostAnswers
                postId={postId}
                commentId={comment.id}
                setIsAnswersOpened={setIsAnswersOpened}
            />}
        </>
    );
};