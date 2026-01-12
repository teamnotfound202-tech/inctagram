import s from './PostAnswers.module.scss'
import {useFetchInfinityAnswersForCommentInfiniteQuery} from "@/features/answers/api/answers-api";
import {PAGINATION} from "@/shared/constants/pagination";
import {useFetchMyProfileQuery} from "@/features/publicUserApi/publicUserApi";
import {
    AddAnswerForm
} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostComments/PostAnswers/AddAnswerForm/AddAnswerForm";
import {useMemo, useRef} from "react";
import {
    CommentAnswer
} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostComments/PostAnswers/CommentAnswer/CommentAnswer";
import {
    HideAnswerBlock
} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostComments/PostAnswers/HideAnswerBlock/HideAnswerBlock";
import {useInfiniteScroll} from "@/shared/lib/hooks";
import Spinner from "@/shared/ui/Spinner/Spinner";
import {useAppSelector} from "@/shared/lib/hooks/hooks";
import {selectCurrentMessages} from "@/shared/api/appSlice";


type Props = {
    postId: number
    commentId: number
    setIsAnswersOpened: (isAnswersOpened: boolean) => void;
};
export const PostAnswers = ({postId, commentId, setIsAnswersOpened}: Props) => {
    const currentLanguage = useAppSelector(selectCurrentMessages)

    const {data: answers, hasNextPage, fetchNextPage, isFetching} = useFetchInfinityAnswersForCommentInfiniteQuery({
        postId: postId,
        commentId: commentId,
        pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
        sortDirection: 'desc',
    })
    const {data: userMe, isLoading} = useFetchMyProfileQuery()

    const answersDataRaw = useMemo(() => answers?.pages.flatMap(answer =>
        answer.items) ?? [], [answers?.pages])

    const answersCount = answers?.pages[0].totalCount

    //ref на элемент обертку, относительно которого происходит infinity scroll
    const scrollRef = useRef<HTMLDivElement | null>(null)

    const {observerRef} = useInfiniteScroll({
        hasNextPage,
        isFetching,
        fetchNextPage,
        rootRef: scrollRef,
        enabled: true,
        rootMargin: '0px',
        threshold: 0.01,
    })

    return (
        <div className={s.answerBlockWrapper}>
            {!!answersCount && <HideAnswerBlock answersCount={answersCount || 0} setIsAnswersOpened={setIsAnswersOpened}/>}

            {!!answersDataRaw.length && answersDataRaw?.map(answer => (
                <CommentAnswer key={answer.id} postId={postId} answer={answer} commentId={commentId}/>
            ))}

            {hasNextPage && (
                <div ref={observerRef} className={s.sentinel}>
                    {isFetching ? (
                        <Spinner
                            type="secondary"
                            size={10}
                            label={currentLanguage.common.loading}
                            fullWidth
                            center
                        />
                    ) : ('')}
                </div>
            )}

            {!isLoading && userMe && (
                <AddAnswerForm
                    postId={postId}
                    commentId={commentId}
                    user={{
                        id: userMe.id,
                        username: userMe.userName,
                        avatars: userMe.avatars,
                    }}
                />
            )}
        </div>
    );
};