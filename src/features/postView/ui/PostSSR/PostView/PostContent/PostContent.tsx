import s from "./PostContent.module.scss"
import {PostTitle} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostTitle/PostTitle";
import {
    PostMetaInfWithControls
} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostMetaInfWithControls/PostMetaInfWithControls";
import {AddCommentForm} from "@/features/postView/ui/PostSSR/PostView/PostContent/AddCommentForm/AddCommentForm";
import {PostComments} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostComments/PostComments";
import {useFetchMyProfileQuery} from "@/features/publicUserApi/publicUserApi";
import {Post} from "@/features/publicUserApi/types";

type Props = {
    post: Post
};
export const PostContent = ({post}: Props) => {
    const {data: userMe, isLoading} = useFetchMyProfileQuery()

    return (
        <div className={s.postContentWrapper}>
            <PostTitle ownerId={post.ownerId}
                       firstName={post.owner.firstName}
                       lastName={post.owner.lastName}/>
            <PostComments post={post}/>
            <PostMetaInfWithControls id={post.id}
                                     avatars={post.avatarWhoLikes}
                                     likesCount={post.likesCount}
                                     updatedAt={post.updatedAt}
                                     isLiked={post.isLiked}
            />
            {!isLoading && userMe && <AddCommentForm postId={post.id} user={{
                id: userMe.id,
                username: userMe.userName,
                avatars: [...userMe.avatars]
            }}/>}
        </div>
    );
};

