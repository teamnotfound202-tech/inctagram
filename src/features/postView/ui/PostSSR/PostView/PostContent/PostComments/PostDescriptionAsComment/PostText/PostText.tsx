import s from "./PostText.module.scss";
import {getTimeDifference} from "@/shared/lib/utils/getTimeDifference";
import {selectLanguage} from "@/shared/api/appSlice";
import {useAppSelector} from "@/shared/lib/hooks/hooks";
import Link from 'next/link'

type Props = {
    authorName: string | null
    postContent: string
    descriptionCreationTime?: string
    postUserName: string
    ownerId: number
};
export const PostText = ({
    authorName,
    postContent,
    descriptionCreationTime,
    postUserName,
    ownerId
}: Props) => {
    const currentLanguage = useAppSelector(selectLanguage)
    const commentCreationTime = descriptionCreationTime && getTimeDifference(descriptionCreationTime, currentLanguage)

    return (
        <div className={s.postText}>
          <Link className={s.postLink} href={`/profile/${ownerId}`}>
            <span className={s.commentAuthorName}>{authorName ? authorName :postUserName} </span>
          </Link>
            <p className={s.commentDescription}>{postContent}</p>
          {descriptionCreationTime && (
              <div className={s.commentMeta}>
                <div className={s.commentCreationTime}>{commentCreationTime}</div>
              </div>
            )
          }
        </div>
    );
};