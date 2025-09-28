'use client'
import s from "./PostComment.module.scss";
import Avatar from "../../../../../../../../entities/user/ui/Avatar/Avatar";
import Heart from "@/features/postView/ui/PostSSR/PostView/Icons/heart.svg";
import DisLike from "@/features/postView/ui/PostSSR/PostView/Icons/DisLike.svg";
import {Comment} from "@/features/postView/api/types";
import {getTimeDifference} from "@/shared/lib/utils/getTimeDifference";
import {useAppSelector} from "@/shared/lib/hooks/hooks";
import {selectCurrentMessages} from "@/shared/api/appSlice";


type Props = {
    comment: Comment
};

export const PostComment = ({comment}: Props) => {
    const currentLanguage = useAppSelector(selectCurrentMessages)

    const likeHandler = () => {
        //TODO: запрос на изменение лайка
    }

    const commentCreationTime = getTimeDifference(comment.createdAt)

    return (
        <article className={s.comment}>
            <Avatar src={comment.from?.avatars[0]?.url} alt={'avatar'} size={"small"}/>
            <div className={s.postText}>
                <span className={s.commentAuthorName}>{comment.from.username}  </span>
                <p className={s.commentDescription}>{comment.content}</p>
                <div className={s.commentMeta}>
                    <div className={s.commentCreationTime}>{commentCreationTime}</div>
                    {comment.likeCount && <div className={s.likesCount}>Like: {comment.likeCount}</div>}
                    <span className={s.answerLink}>{currentLanguage.posts.answer}</span> {/*TODO: добавить слова в словарь*/}
                    <div className={s.commentAnswer}> answerCount {comment.answerCount}</div>
                    {/*TODO доделать открытие ответов комментариев*/}
                </div>
            </div>
            <button className={s.postIconButton} onClick={likeHandler}>
                {comment.isLiked ? <Heart/> : <DisLike/>}
            </button>
        </article>

    );
};