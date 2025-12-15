import s from "./ViewMessagesZone.module.scss";

import {NotMyMessage} from "@/features/messenger/ui/Messenger/ChatZone/message/NotMyMessage/NotMyMessage";
import {useFetchMessagesFromPartnerInfiniteQuery} from "@/features/messenger/api/messengerApi";
import {Loader} from "@/shared/ui/Loader/Loader";
import {MyMessage} from "@/features/messenger/ui/Messenger/ChatZone/message/MyMessage/MyMessage";
import {useMeQuery} from "@/features/auth/api/authApi";
import {useEffect, useRef} from "react";
import {useInfiniteScroll} from "@/shared/lib/hooks";
import {useMessagesScroll} from "@/shared/lib/hooks/useMessagesScroll";

type Props = {
    activeUserIdChat: number
}

export const ViewMessagesZone = ({activeUserIdChat}: Props) => {

    const {
        data,
        isLoading,
        hasNextPage,
        isFetching,
        fetchNextPage,
        isFetchingNextPage
    } = useFetchMessagesFromPartnerInfiniteQuery({dialoguePartnerId: activeUserIdChat})
    const {data: me} = useMeQuery()

    const messages = data?.pages.flatMap(page => page.items)

    const scrollRef = useRef<HTMLDivElement | null>(null)
    const {observerRef} = useInfiniteScroll({
        hasNextPage,
        isFetching,
        fetchNextPage,
        rootRef: scrollRef,
        enabled: true,
        rootMargin: '0px'
    })

    const {messagesEndRef, messagesContainerRef, isAtBottom, scrollToBottom} = useMessagesScroll()

    // Автоматический скролл вниз при добавлении новых сообщений 
    useEffect(() => {
        if (messages && messages.length > 0) {
            // Используем setTimeout чтобы дать React время отрендерить новые сообщения
            setTimeout(() => {
                scrollToBottom();
            }, 0);
        }
    }, [messages?.length, scrollToBottom]);

    const renderedMessages = messages?.map((message) => (
        message.ownerId === me?.userId ?                //Если мое сообщение
            <MyMessage key={message.id}
                       id={message.id}
                       text={message.messageText}
                       createdAt={message.createdAt}
                       updatedAt={message.updatedAt}
                       status={message.status}
                       activeUserIdChat={activeUserIdChat}
            /> :
            <NotMyMessage key={message.id}
                          text={message.messageText}
                          dateTime={message.createdAt}
            />
    ))

    if (isLoading) return <Loader/>

    return (<div className={s.viewMessagesZoneWrapper}>
            {!isAtBottom && <button onClick={scrollToBottom} className={s.scrollToBottomButton}>Down</button>}
            <div className={s.viewMessagesZone} ref={messagesContainerRef}>
                {/*ссылка для скролла вниз*/}
                <div ref={messagesEndRef} style={{height: '2px'}}/>
                {messages && messages.length > 0 && renderedMessages}
                {messages && messages.length === 0 ? (
                    <p>There are no messages</p>
                ) : hasNextPage}
                {hasNextPage && (
                    <div ref={observerRef} className={s.loadingWrapper}>
                        {isFetchingNextPage ? <div>Loading more ...</div> : <div style={{height: '2px'}}/>}
                    </div>
                )}
            </div>
        </div>
    );
};
