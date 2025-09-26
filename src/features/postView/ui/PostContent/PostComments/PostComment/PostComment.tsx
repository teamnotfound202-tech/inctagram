'use client'
import {useState} from "react";
import s from "@/features/postView/ui/PostContent/PostComments/PostComment/PostComment.module.scss";
import Avatar from "../../../../../../entities/user/ui/Avatar/Avatar";
import Heart from "@/features/postView/ui/Icons/heart.svg";
import DisLike from "@/features/postView/ui/Icons/DisLike.svg";

type Props = {
    avatarOwner: string
};
export const PostComment = ({avatarOwner}: Props) => {
    const [like, setLike] = useState(true)
    const likeHandler = () => {
        setLike(prev => !prev)
    }
    return (
        <article className={s.comment}>
            <Avatar src={avatarOwner} alt={'avatar'} size={"small"}/>
            <div className={s.commentAuthorName}></div>
            <div className={s.commentDescription}></div>
            <div className={s.commentCreationTime}></div>
            <div className={s.likesCount}></div>
            <div className={s.commentAnswer}></div>
            <button className={s.postIconButton} onClick={likeHandler}>
                {like ? <Heart/> : <DisLike/>}
            </button>
        </article>

    );
};