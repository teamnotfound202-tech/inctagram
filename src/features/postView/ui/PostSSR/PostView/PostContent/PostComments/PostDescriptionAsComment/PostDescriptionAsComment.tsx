'use client'
import s from "../PostComment/PostComment.module.scss";
import Avatar from "../../../../../../../../entities/user/ui/Avatar/Avatar";
import {getTimeDifference} from "@/shared/lib/utils/getTimeDifference";

type Props = {
    avatarUrl: string
    authorName: string
    postContent: string
    descriptionCreationTime: string
};

export const PostDescriptionAsComment = ({
                                             avatarUrl,
                                             authorName,
                                             descriptionCreationTime,
                                             postContent
                                         }: Props) => {

    const commentCreationTime = getTimeDifference(descriptionCreationTime)

    return (
        <article className={s.comment}>
            <Avatar src={avatarUrl} alt={'avatar'} size={"small"}/>
            <div className={s.postText}>
                <span className={s.commentAuthorName}>{authorName}  </span>
                <p className={s.commentDescription}>{postContent}</p>
                <div className={s.commentMeta}>
                    <div className={s.commentCreationTime}>{commentCreationTime}</div>
                </div>
            </div>
        </article>

    );
};