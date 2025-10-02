// @flow
import * as React from 'react';
import s
    from "@/features/postView/ui/PostSSR/PostView/PostContent/PostComments/PostComment/CommentText/CommentText.module.scss";
import {useAppSelector} from "@/shared/lib/hooks/hooks";
import {selectCurrentMessages} from "@/shared/api/appSlice";
import {getTimeDifference} from "@/shared/lib/utils/getTimeDifference";

type Props = {
    username: string
    content: string
    createdAt: string
    likeCount: number
    answerCount: number
};
export const CommentText = ({
                                content,
                                createdAt,
                                likeCount,
                                username,
                                answerCount
                            }: Props) => {
    const currentLanguage = useAppSelector(selectCurrentMessages)

    const commentCreationTime = getTimeDifference(createdAt)
    return (
        <div className={s.postText}>
            <span className={s.commentAuthorName}>{username}  </span>
            <p className={s.commentDescription}>{content}</p>
            <div className={s.commentMeta}>
                <div className={s.commentCreationTime}>{commentCreationTime}</div>
                {likeCount && <div className={s.likesCount}>Like: {likeCount}</div>}
                <span
                    className={s.answerLink}>{currentLanguage.posts.answer}</span> {/*TODO: добавить слова в словарь*/}
                <div className={s.commentAnswer}> answerCount {answerCount}</div>
                {/*TODO доделать открытие ответов комментариев*/}
            </div>
        </div>
    );
};