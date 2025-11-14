import s from './PostComments.module.scss';
import {PostComment} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostComments/PostComment/PostComment";
import {
    PostDescriptionAsComment
} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostComments/PostDescriptionAsComment/PostDescriptionAsComment";
import {useFetchInfinityPostCommentsInfiniteQuery} from "@/features/posts/api/posts-api";
import {Post} from "@/features/publicUserApi/types";
import {useMemo, useRef} from "react";
import {PAGINATION} from "@/features/notificationsApi/notificationsConstants";
import {useInfiniteScroll} from "@/shared/lib/hooks";
import Spinner from "@/shared/ui/Spinner/Spinner";
import {useAppSelector} from "@/shared/lib/hooks/hooks";
import {selectCurrentMessages} from "@/shared/api/appSlice";
import {PostAnswers} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostComments/PostAnswers/PostAnswers";

type Props = {
    post: Post
};
export const PostComments = ({post}: Props) => {
    const messages = useAppSelector(selectCurrentMessages)

    const {data, hasNextPage, fetchNextPage, isFetching} = useFetchInfinityPostCommentsInfiniteQuery({
        postId: post.id,
        pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
        sortDirection: 'desc'
    })

    const commentsDataRaw = useMemo(() => data?.pages.flatMap(p => p.items) ?? [], [data?.pages])

    //ref на элемент обертку, относительно которого происходит infinity scroll
    const scrollRef = useRef<HTMLDivElement | null>(null)

    const {observerRef} = useInfiniteScroll({
        hasNextPage,
        isFetching,
        fetchNextPage,
        rootRef: scrollRef,
        enabled: true,
        rootMargin: '0px 0px 0px 0px',
        threshold: 0.01,
    })

    return (
        <div className={s.commentsWrapper} ref={scrollRef}>
            <PostDescriptionAsComment
                authorName={post.owner.firstName && post.owner.lastName ? post.owner.firstName + ' ' + post.owner.lastName : null}
                postContent={post.description}
                descriptionCreationTime={post.createdAt}
                ownerId={post.ownerId}
                postUserName={post.userName}
            />

            {commentsDataRaw.map(comment => (
                <>
                    <PostComment key={comment.id} comment={comment} postId={post.id}/>
                    {!!comment.answerCount && <PostAnswers postId={post.id} commentId={comment.id}/>}
                </>
            ))}

            {hasNextPage && (
                <div ref={observerRef} className={s.sentinel}>
                    {isFetching ? (
                        <Spinner
                            type="secondary"
                            size={10}
                            label={messages.common.loading}
                            fullWidth
                            center
                        />
                    ) : ('')}
                </div>
            )}
        </div>
    )
};