// @flow
import * as React from 'react';
import {Answer} from "@/features/publicUserApi/types";
import s from "./CommentAnswer.module.scss";
import Avatar from "../../../../../../../../../entities/user/ui/Avatar/Avatar";
import {
    AnswerText
} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostComments/PostAnswers/CommentAnswer/AnswerText/AnswerText";

type Props = {
    answer: Answer;
    commentId: number
};
export const CommentAnswer = ({answer, commentId}: Props) => {
    /*const [updateCommentLikeStatus] = useUpdateCommentLikeStatusMutation()
    const {data: meUser} = useMeQuery()

    const likeHandler = () => {
        const newLikeStatus = comment.isLiked ? LikeStatus.NONE : LikeStatus.LIKE
        updateCommentLikeStatus({commentId: comment.id, postId, likeStatus: newLikeStatus})
    }
*/
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
                {/* <LikeButton isLiked={answer.isLiked} onClick={likeHandler}
                            disabled={!meUser?.userId}/> TODO: проверить дизейбл кнопок, если не залогинен*/}
            </div>

            {/*<CommentMeta comment={comment} isAnswersOpened={isAnswersOpened} setIsAnswersOpened={setIsAnswersOpened}/>*/}
        </article>

    );
};