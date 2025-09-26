import s from './PostComments.module.scss';
import {PostComment} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostComments/PostComment/PostComment";
import {useFetchPostCommentsQuery} from "@/features/postView/api/postApi";

type Props = {
    avatarOwner: string
    postId: number
};
export const PostComments = ({avatarOwner, postId}: Props) => {
    const {data, isFetching} = useFetchPostCommentsQuery(postId)

    console.log(data)

    if (isFetching) return <div>...Loading</div> //TODO: добавить глобальную обработку Loading
    return (
        <div  className={s.commentsWrapper}>
            {data?.items.map(comment => (
                <PostComment key={comment.id} comment={comment}/>
            ))}
        </div>
    );
};