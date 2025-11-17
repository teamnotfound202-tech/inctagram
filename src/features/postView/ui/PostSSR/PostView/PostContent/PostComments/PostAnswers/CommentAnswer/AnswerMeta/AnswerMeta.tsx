import s
    from "@/features/postView/ui/PostSSR/PostView/PostContent/PostComments/PostComment/CommentText/CommentText.module.scss";
import {Answer} from "@/features/publicUserApi/types";
import {useAppSelector} from "@/shared/lib/hooks/hooks";
import {selectCurrentMessages, selectLanguage} from "@/shared/api/appSlice";
import {getTimeDifference} from "@/shared/lib/utils/getTimeDifference";

type Props = {
    answer: Answer;
};
export const AnswerMeta = ({answer/*, isAnswersOpened, setIsAnswersOpened*/}: Props) => {
    const messages = useAppSelector(selectCurrentMessages)
    const currentLanguage = useAppSelector(selectLanguage)

    const commentCreationTime = getTimeDifference(answer.createdAt, currentLanguage)

    return (
        <div className={s.commentMeta}>
            <div className={s.commentCreationTime}>{commentCreationTime}</div>
            {!!answer.likeCount &&
                <div
                    className={s.commentAnswer}>  {`${messages.posts.like}: ${answer.likeCount}`}</div>}
        </div>
    );
};