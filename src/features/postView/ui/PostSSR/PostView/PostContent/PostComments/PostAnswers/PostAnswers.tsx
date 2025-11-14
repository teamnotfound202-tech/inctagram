import {useFetchInfinityAnswersForCommentInfiniteQuery} from "@/features/posts/api/posts-api";
import {PAGINATION} from "@/shared/constants/pagination";
import {AddCommentForm} from "@/features/postView/ui/PostSSR/PostView/PostContent/AddCommentForm/AddCommentForm";
import {useFetchMyProfileQuery} from "@/features/publicUserApi/publicUserApi";
import {
    AddAnswerForm
} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostComments/PostAnswers/AddAnswerForm/AddAnswerForm";
import {PostComment} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostComments/PostComment/PostComment";
import {useMemo} from "react";
import {
    CommentAnswer
} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostComments/PostAnswers/CommentAnswer/CommentAnswer";

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
    const {data: userMe, isLoading} = useFetchMyProfileQuery()

    const answersDataRaw = useMemo(() => answers?.pages.flatMap(answer =>
        answer.items) ?? [], [answers?.pages])

    return (
        <div>
            {answersDataRaw.length && answersDataRaw?.map(answer => (
                <CommentAnswer key={answer.id} answer={answer} commentId={commentId}/>
            ))}

            {!isLoading && userMe && (
                <AddAnswerForm
                    postId={postId}
                    commentId={commentId}
                    user={{
                        id: userMe.id,
                        username: userMe.userName,
                        avatars: [...userMe.avatars],
                    }}
                />
            )}
        </div>
    );
};