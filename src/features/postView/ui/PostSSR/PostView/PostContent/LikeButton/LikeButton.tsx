import s from "@/features/postView/ui/PostSSR/PostView/PostContent/PostComments/PostComment/PostComment.module.scss";
import Heart from "@/features/postView/ui/PostSSR/PostView/Icons/littleLike/heart.svg";
import DisLike from "@/features/postView/ui/PostSSR/PostView/Icons/littleLike/DisLike.svg";

type Props = {
    onClick: () => void
    isLiked: boolean
    className?: string
    disabled?: boolean
};
export const LikeButton = ({isLiked, onClick, className, disabled}: Props) => {
    const likeHandler = () => {
        onClick()
    }
    const finishClassName = s.likeButton + ' ' + (className ? className : '') + (disabled ? s.disabled : '')

    return (
        <button className={finishClassName} onClick={likeHandler} disabled={disabled || false}>
            {isLiked ? <Heart/> : <DisLike/>}
        </button>
    );
};