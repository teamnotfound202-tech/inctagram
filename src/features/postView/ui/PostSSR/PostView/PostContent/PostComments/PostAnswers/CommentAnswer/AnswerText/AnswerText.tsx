import s from "./AnswerText.module.scss";
import {
    AnswerMeta
} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostComments/PostAnswers/CommentAnswer/AnswerMeta/AnswerMeta";
import {Answer} from "@/features/publicUserApi/types";

type Props = {
    username: string
    content: string
    createdAt: string
    likeCount: number
    answerCount?: number
    answer: Answer;
};
export const AnswerText = ({
                               content,
                               username,
                               answer
                           }: Props) => {
    return (
        <div>
            <div className={s.answerText}>
                <span className={s.answerAuthorName}>{username}  </span>
                <p className={s.answerDescription}>{content}</p>
            </div>
            <AnswerMeta answer={answer} />
            {/*<CommentMeta comment={comment} isAnswersOpened={isAnswersOpened} setIsAnswersOpened={setIsAnswersOpened}/>*/}
        </div>

    );
};