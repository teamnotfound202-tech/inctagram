import s from "./PostText.module.scss";
import {getTimeDifference} from "@/shared/lib/utils/getTimeDifference";
import {selectLanguage} from "@/shared/api/appSlice";
import {useAppSelector} from "@/shared/lib/hooks/hooks";

type Props = {
    authorName: string | null
    postContent: string
    descriptionCreationTime: string
    postUserName: string
};
export const PostText = ({
    authorName,
    postContent,
    descriptionCreationTime,
    postUserName
}: Props) => {
    const currentLanguage = useAppSelector(selectLanguage)
    const commentCreationTime = getTimeDifference(descriptionCreationTime, currentLanguage)

    return (
        <div className={s.postText}>
            <span className={s.commentAuthorName}>{authorName ? authorName :postUserName} </span>
            <p className={s.commentDescription}>{postContent}</p>
            <div className={s.commentMeta}>
                <div className={s.commentCreationTime}>{commentCreationTime}</div>
            </div>
        </div>
    );
};