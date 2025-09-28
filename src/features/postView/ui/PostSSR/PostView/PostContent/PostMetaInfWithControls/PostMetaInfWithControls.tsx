import s from "./PostMetaInfWithControls.module.scss";
import LikeIcon from "@/features/postView/ui/PostSSR/PostView/Icons/Like.svg";
import PaperPlane from "@/features/postView/ui/PostSSR/PostView/Icons/paper-plane-outline.svg";
import Bookmark from "@/features/postView/ui/PostSSR/PostView/Icons/Bookmark.svg";
import Avatar from "../../../../../../../entities/user/ui/Avatar/Avatar";
import {timeToTimeZone} from "@/shared/lib/utils/timeToTimeZone";
import {useAppSelector} from "@/shared/lib/hooks/hooks";
import {selectCurrentMessages} from "@/shared/api/appSlice";

type Props = {
    avatars: string[],
    likesCount: number,
    updatedAt: string
};

export const PostMetaInfWithControls = ({avatars, likesCount, updatedAt}: Props) => {
    const currentLanguage = useAppSelector(selectCurrentMessages)
    const postUpdateTime = timeToTimeZone(updatedAt)

    return (
        <div className={s.postMetaInf}>
            <div className={s.controls}>
                <button className={s.postIconButton}>
                    <LikeIcon/>
                </button>
                <button className={s.postIconButton}>
                    <PaperPlane/>
                </button>
                <button className={s.postIconButton + ' ' + s.leftControl}>
                    <Bookmark/>
                </button>
            </div>
            <div className={s.avatarsWhoLikes}>
                <Avatar src={avatars[0]} alt={'avatarsWhoLikes'} size={'very_small'}/>
                <div className={s.likesCount}>{likesCount} &#34;{currentLanguage.posts.like}&#34;</div>
            </div>
            <div className={s.postCreationTime}>{postUpdateTime}</div>
        </div>
    );
};