import s from './PostComments.module.scss';
import {PostComment} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostComments/PostComment/PostComment";
import {
    PostDescriptionAsComment
} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostComments/PostDescriptionAsComment/PostDescriptionAsComment";
import {Loader} from "@/shared/ui/Loader/Loader";
import {useFetchPostCommentsQuery} from "@/features/posts/api/posts-api";
import {Post} from "@/features/publicUserApi/types";

type Props = {
    post: Post
};
export const PostComments = ({post}: Props) => {
    const {data, isLoading} = useFetchPostCommentsQuery(post.id)

    if (isLoading) return <Loader/>;

    return (
        <div className={s.commentsWrapper}>
            <PostDescriptionAsComment authorName={post.owner.firstName && post.owner.lastName ?  post.owner.firstName + ' ' + post.owner.lastName : null}
                                      postContent={post.description}
                                      descriptionCreationTime={post.createdAt}
                                      ownerId={post.ownerId}
                                      postUserName={post.userName}
            />
            {data?.items.map(comment => (
                <PostComment key={comment.id} comment={comment} postId={post.id}/>
            ))}
        </div>
    )
};