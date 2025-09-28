import {Post} from "@/features/postView/api/types";
import s from "./PostContent.module.scss"
import {PostTitle} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostTitle/PostTitle";
import {
    PostMetaInfWithControls
} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostMetaInfWithControls/PostMetaInfWithControls";
import {AddCommentForm} from "@/features/postView/ui/PostSSR/PostView/PostContent/AddCommentForm/AddCommentForm";
import {PostComments} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostComments/PostComments";

type Props = {
    post: Post
};
export const PostContent = ({post}: Props) => {
    return (
        <div className={s.postContentWrapper}>
            <PostTitle avatarOwner={post.avatarOwner} userName={post.userName} commentOwnerId={post.ownerId}/>
            <PostComments post={post}/>
            <PostMetaInfWithControls
                avatars={[post.avatarOwner]}
                likesCount={post.likesCount}
                updatedAt={post.updatedAt}
            />
            <AddCommentForm/>
        </div>
    );
};

