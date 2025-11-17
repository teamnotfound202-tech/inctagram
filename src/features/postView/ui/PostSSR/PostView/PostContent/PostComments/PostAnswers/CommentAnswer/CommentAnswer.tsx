// @flow
import * as React from 'react';
import {Answer, LikeStatus} from "@/features/publicUserApi/types";
import s from "./CommentAnswer.module.scss";
import Avatar from "../../../../../../../../../entities/user/ui/Avatar/Avatar";
import {
    AnswerText
} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostComments/PostAnswers/CommentAnswer/AnswerText/AnswerText";
import {LikeButton} from "@/features/postView/ui/PostSSR/PostView/PostContent/LikeButton/LikeButton";
import {useMeQuery} from "@/features/auth/api/authApi";
import {useUpdateAnswerLikeStatusMutation} from "@/features/answers/api/answers-api";

type Props = {
    answer: Answer
    commentId: number
    postId: number
};
export const CommentAnswer = ({answer, commentId, postId}: Props) => {
    const [updateAnswerLikeStatus] = useUpdateAnswerLikeStatusMutation()
    const {data: meUser} = useMeQuery()

    const likeHandler = () => {
        const newLikeStatus = answer.isLiked ? LikeStatus.NONE : LikeStatus.LIKE
        updateAnswerLikeStatus({ postId, commentId, answerId: answer.id, likeStatus: newLikeStatus})
    }
    return (
        <article className={s.answer}>
            <div className={s.answerBody}>
                <Avatar src={answer.from?.avatars[0]?.url} alt={'avatar'} size={"small"}/>
                <AnswerText content={answer.content}
                            createdAt={answer.createdAt}
                            likeCount={answer.likeCount}
                            username={answer.from.username}
                            answer={answer}
                />
                 <LikeButton isLiked={answer.isLiked} onClick={likeHandler}
                            disabled={!meUser?.userId}/>
            </div>
        </article>

    );
};