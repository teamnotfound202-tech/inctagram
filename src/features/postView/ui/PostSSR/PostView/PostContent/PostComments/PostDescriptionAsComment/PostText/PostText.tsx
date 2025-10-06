import s from "./PostText.module.scss";
import {getTimeDifference} from "@/shared/lib/utils/getTimeDifference";

type Props = {
    authorName: string;
    postContent?: string;
    descriptionCreationTime: string;
};
export const PostText = ({authorName, postContent,descriptionCreationTime}: Props) => {

    const commentCreationTime = getTimeDifference(descriptionCreationTime)

    return (
        <div className={s.postText}>
            <span className={s.commentAuthorName}>{authorName}  </span>
            <p className={s.commentDescription}>{postContent}</p>
            <div className={s.commentMeta}>
                <div className={s.commentCreationTime}>{commentCreationTime}</div>
            </div>
        </div>
    );
};