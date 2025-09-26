import s from "./PostMetaInfWithControls.module.scss";
import LikeIcon from "@/features/postView/ui/Icons/Like.svg";
import PaperPlane from "@/features/postView/ui/Icons/paper-plane-outline.svg";
import Bookmark from "@/features/postView/ui/Icons/Bookmark.svg";
import Avatar from "../../../../../entities/user/ui/Avatar/Avatar";

type Props = {
    avatars: string[],
    likesCount: number,
    updatedAt: string
};
export const PostMetaInfWithControls = ({avatars, likesCount, updatedAt}: Props) => {
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
                <div className={s.likesCount}>{likesCount} &#34;Like&#34;</div>
            </div>
            <div className={s.commentCreationTime}>{updatedAt}</div>
        </div>
    );
};