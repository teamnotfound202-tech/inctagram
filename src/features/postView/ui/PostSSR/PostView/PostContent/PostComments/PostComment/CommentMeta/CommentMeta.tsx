import s
    from "@/features/postView/ui/PostSSR/PostView/PostContent/PostComments/PostComment/CommentText/CommentText.module.scss";
import {type Comment} from '@/features/publicUserApi/types'
import {useAppSelector} from "@/shared/lib/hooks/hooks";
import {selectCurrentMessages, selectLanguage} from "@/shared/api/appSlice";
import {getTimeDifference} from "@/shared/lib/utils/getTimeDifference";

type Props = {
    comment: Comment;
    isAnswersOpened: boolean;
    setIsAnswersOpened: (isAnswersOpened: boolean) => void;
};
export const CommentMeta = ({comment, isAnswersOpened, setIsAnswersOpened}: Props) => {
    const messages = useAppSelector(selectCurrentMessages)
    const currentLanguage = useAppSelector(selectLanguage)

    const commentCreationTime = getTimeDifference(comment.createdAt, currentLanguage)

    return (
        <div className={s.commentMeta}>
            <div className={s.commentCreationTime}>{commentCreationTime}</div>
            {!!comment.likeCount && <div className={s.likesCount}>{messages.posts.like}: {comment.likeCount}</div>}
            <span className={s.answerLink} onClick={() => {
                setIsAnswersOpened(!isAnswersOpened)
            }}>{messages.posts.answer}</span>
        </div>
    );
};