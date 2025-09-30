import s from "@/features/postView/ui/PostSSR/PostView/PostContent/PostComments/PostComment/PostComment.module.scss";
import Heart from "@/features/postView/ui/PostSSR/PostView/Icons/littleLike/heart.svg";
import DisLike from "@/features/postView/ui/PostSSR/PostView/Icons/littleLike/DisLike.svg";

type Props = {
    onClick: () => void
    isLiked: boolean
    className?: string
};
export const LikeButton = ({isLiked, onClick, className}: Props) => {
    const likeHandler = () => {
        onClick()
    }

    return (
        <button className={s.likeButton + ' ' + className } onClick={likeHandler}>
            {isLiked ? <Heart/> : <DisLike/>}
        </button>
    );
};