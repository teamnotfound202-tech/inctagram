import {From, Post} from "@/features/postView/api/types";
import s from "./PostContent.module.scss"
import {PostTitle} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostTitle/PostTitle";
import {
    PostMetaInfWithControls
} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostMetaInfWithControls/PostMetaInfWithControls";
import {AddCommentForm} from "@/features/postView/ui/PostSSR/PostView/PostContent/AddCommentForm/AddCommentForm";
import {PostComments} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostComments/PostComments";
import {useFetchUsersProfileQuery} from "@/features/postView/api/postApi";

type Props = {
    post: Post
};
export const PostContent = ({post}: Props) => {
    const {data: meUser, isLoading} = useFetchUsersProfileQuery()

    return (
        <div className={s.postContentWrapper}>
            <PostTitle avatarOwner={post.avatarOwner} userName={post.userName} commentOwnerId={post.ownerId}/>
            <PostComments post={post}/>
            <PostMetaInfWithControls id={post.id}
                avatars={[post.avatarOwner]}
                likesCount={post.likesCount}
                updatedAt={post.updatedAt}
                isLiked={post.isLiked}
            />
            {!isLoading && meUser?.id && <AddCommentForm postId={post.id} user={{
                id: meUser.id,
                username: meUser.userName,
                avatars: [...meUser.avatars]
            }}/>}
        </div>
    );
};

