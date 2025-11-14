import s from "./CommentText.module.scss";
import {
    CommentMeta
} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostComments/PostComment/CommentMeta/CommentMeta";
import {Comment} from "@/features/publicUserApi/types";

type Props = {
    username: string
    content: string
    createdAt: string
    likeCount: number
    answerCount?: number
    comment: Comment;
    isAnswersOpened: boolean;
    setIsAnswersOpened: (isAnswersOpened: boolean) => void;
};
export const CommentText = ({
                                content,
                                username,
                                comment,
                                isAnswersOpened,
                                setIsAnswersOpened
                            }: Props) => {
    return (
        <div className={s.commentTextWrapper}>
            <div className={s.postText}>
                <span className={s.commentAuthorName}>{username}  </span>
                <p className={s.commentDescription}>{content}</p>
            </div>
            <CommentMeta comment={comment} isAnswersOpened={isAnswersOpened} setIsAnswersOpened={setIsAnswersOpened}/>
        </div>

    );
};