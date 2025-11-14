import s
    from "@/features/postView/ui/PostSSR/PostView/PostContent/PostComments/PostComment/CommentText/CommentText.module.scss";
import {type Comment} from '@/features/publicUserApi/types'
import {useAppSelector} from "@/shared/lib/hooks/hooks";
import {selectCurrentMessages} from "@/shared/api/appSlice";
import {getTimeDifference} from "@/shared/lib/utils/getTimeDifference";

type Props = {
    comment: Comment;
    isAnswersOpened: boolean;
    setIsAnswersOpened: (isAnswersOpened: boolean) => void;
};
export const CommentMeta = ({comment, isAnswersOpened, setIsAnswersOpened}: Props) => {
    const currentLanguage = useAppSelector(selectCurrentMessages)

    const commentCreationTime = getTimeDifference(comment.createdAt)

    return (
        <div className={s.commentMeta}>
            <div className={s.commentCreationTime}>{commentCreationTime}</div>
            {!!comment.likeCount && <div className={s.likesCount}>Like: {comment.likeCount}</div>}
            <span className={s.answerLink} onClick={() => {
                setIsAnswersOpened(!isAnswersOpened)
            }}>{currentLanguage.posts.answer}</span>
            {!!comment.answerCount &&
                <div
                    className={s.commentAnswer}>  {`${currentLanguage.posts.answersCount} ${comment.answerCount}`}</div>}
        </div>
    );
};