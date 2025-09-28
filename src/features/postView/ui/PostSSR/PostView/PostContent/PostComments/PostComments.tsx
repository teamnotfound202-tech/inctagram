import s from './PostComments.module.scss';
import {PostComment} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostComments/PostComment/PostComment";
import {useFetchPostCommentsQuery} from "@/features/postView/api/postApi";
import {
    PostDescriptionAsComment
} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostComments/PostDescriptionAsComment/PostDescriptionAsComment";
import {Post} from "@/features/postView/api/types";
import {ScrollBox} from "@/shared/ui";

type Props = {
    avatarOwner: string
    post: Post
};
export const PostComments = ({avatarOwner, post}: Props) => {
    const {data} = useFetchPostCommentsQuery(post.id)

    //TODO: добавить глобальную обработку Loading*/
    return (
        <div className={s.commentsWrapper}>
          {/*  <ScrollBox>*/}
                <PostDescriptionAsComment authorName={post.userName}
                                          avatarUrl={post.avatarOwner}
                                          postContent={post.description}
                                          descriptionCreationTime={post.createdAt}/>
                {data?.items.map(comment => (
                    <PostComment key={comment.id} comment={comment}/>
                ))}
            {/*</ScrollBox>*/}
        </div>
    )
};