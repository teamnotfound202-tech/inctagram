import {Post} from "@/features/postView/api/types";
import Avatar from "@/entities/user/ui/Avatar/Avatar";
import s from "./PostContent.module.scss"
import {Button} from "@/shared/ui";
import {useAppSelector} from "@/shared/lib/hooks/hooks";
import {selectCurrentMessages} from "@/shared/api/appSlice";
import {PostComment} from "@/features/postView/ui/PostContent/PostComments/PostComment/PostComment";
import LikeIcon from '../Icons/Like.svg'
import PaperPlane from '../Icons/paper-plane-outline.svg'
import Bookmark from '../Icons/Bookmark.svg'
import Heart from '../Icons/heart.svg'
import {PostTitle} from "@/features/postView/ui/PostContent/PostTitle/PostTitle";
import {
    PostMetaInfWithControls
} from "@/features/postView/ui/PostContent/PostMetaInfWithControls/PostMetaInfWithControls";
import {AddCommentForm} from "@/features/postView/ui/PostContent/AddCommentForm/AddCommentForm";
import {PostComments} from "@/features/postView/ui/PostContent/PostComments/PostComments";

type Props = {
    post: Post
};
export const PostContent = ({post}: Props) => {
    return (
        <div className={s.postContentWrapper}>
            <PostTitle avatarOwner={post.avatarOwner} userName={post.userName}/>
            <PostComments avatarOwner={post.avatarOwner}/>
            <PostMetaInfWithControls
                avatars={[post.avatarOwner]}
                likesCount={post.likesCount}
                updatedAt={post.updatedAt}
            />
            <AddCommentForm/>
        </div>
    );
};

