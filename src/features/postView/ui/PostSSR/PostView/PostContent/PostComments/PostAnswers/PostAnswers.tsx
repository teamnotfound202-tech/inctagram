import {useFetchInfinityAnswersForCommentInfiniteQuery} from "@/features/posts/api/posts-api";
import {PAGINATION} from "@/shared/constants/pagination";

type Props = {
    postId: number
    commentId: number
};
export const PostAnswers = ({postId, commentId}: Props) => {
    const {data: answers, hasNextPage, fetchNextPage, isFetching} = useFetchInfinityAnswersForCommentInfiniteQuery({
        postId: postId,
        commentId: commentId,
        pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
        sortDirection: 'desc',
    })

    return (
        <div>
            PostAnswers for comment {commentId} post {postId}
        </div>
    );
};