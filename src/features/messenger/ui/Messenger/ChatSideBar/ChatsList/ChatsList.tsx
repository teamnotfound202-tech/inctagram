import s from "./ChatsList.module.scss";
import {PersonChat} from "@/features/messenger/ui/Messenger/ChatSideBar/ChatsList/PersonChat/PersonChat";
import {useFetchChatsInfiniteQuery} from "@/features/messenger/api/messengerApi";
import {useAppSelector} from "@/shared/lib/hooks/hooks";
import {selectSearchChatUserName} from "@/shared/api/appSlice";
import {useInfiniteScroll} from "@/shared/lib/hooks";
import {useRef, useState, useEffect} from "react";
import {useMeQuery} from "@/features/auth/api/authApi";

type Props = {
    activeUserIdChat: number | null
    setActiveUserIdChat: (activeChat: number) => void;
}

export const ChatsList = ({activeUserIdChat, setActiveUserIdChat}: Props) => {
    const searchChatUserName = useAppSelector(selectSearchChatUserName)

    // 1. Debounced версия search
    const [debouncedSearch, setDebouncedSearch] = useState(searchChatUserName)

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchChatUserName)
        }, 400) // 400ms задержка

        return () => clearTimeout(timer)
    }, [searchChatUserName])


    const {data: me} = useMeQuery()
    const {
        data,
        hasNextPage,
        isFetching,
        fetchNextPage,
        isFetchingNextPage
    } = useFetchChatsInfiniteQuery({searchName: debouncedSearch})

    const chats = data?.pages.flatMap(page => page.items)

    const scrollRef = useRef<HTMLDivElement | null>(null)
    const {observerRef} = useInfiniteScroll({
        hasNextPage,
        isFetching,
        fetchNextPage,
        rootRef: scrollRef,
        enabled: true,
    })

    const renderedChats = chats?.map((chat) => {
        const receiverId = (chat.receiverId === me?.userId) ? chat.ownerId : chat.receiverId //TODO: проверить
        return <PersonChat key={chat?.id}
                           avatar={(chat?.avatars?.length > 0) ? chat?.avatars[0]?.url : ''}
                           name={chat?.userName}
                           dateTime={chat?.createdAt}
                           message={chat?.messageText}
                           personChatClickHandler={() => setActiveUserIdChat(receiverId)}
                           isActive={activeUserIdChat === chat.receiverId}
        />
    })

    return (
        <div className={s.personsChatsList} ref={scrollRef}>
            {chats && chats.length > 0 && renderedChats}
            {chats && chats.length === 0 ? (
                <p>There are no chats</p>
            ) : hasNextPage}
            {hasNextPage && (
                <div ref={observerRef} className={s.loadingWrapper}>
                    {isFetchingNextPage ? <div>Loading more ...</div> : <div style={{height: '2px'}}/>}
                </div>
            )}
        </div>
    )
};