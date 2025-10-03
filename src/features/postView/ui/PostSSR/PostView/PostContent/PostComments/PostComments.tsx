import s from './PostComments.module.scss';
import {PostComment} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostComments/PostComment/PostComment";
import {
    PostDescriptionAsComment
} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostComments/PostDescriptionAsComment/PostDescriptionAsComment";
import {Post} from "@/features/postView/api/types";
import {Loader} from "@/shared/ui/Loader/Loader";
import {useFetchPostCommentsQuery} from "@/features/posts/api/posts-api";

type Props = {
    post: Post
};
export const PostComments = ({post}: Props) => {
    const {data, isLoading} = useFetchPostCommentsQuery(post.id)

    if (isLoading) return <Loader/>;

    return (
        <div className={s.commentsWrapper}>
            <PostDescriptionAsComment authorName={post.owner.firstName + ' ' + post.owner.lastName}
                                      avatarUrl={post.avatarOwner}
                                      postContent={post.description}
                                      descriptionCreationTime={post.createdAt}/>
            {data?.items.map(comment => (
                <PostComment key={comment.id} comment={comment} postId={post.id}/>
            ))}
        </div>
    )
};