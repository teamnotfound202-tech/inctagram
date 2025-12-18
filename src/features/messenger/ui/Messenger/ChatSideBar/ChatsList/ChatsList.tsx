import s from "./ChatsList.module.scss";
import {PersonChat} from "@/features/messenger/ui/Messenger/ChatSideBar/ChatsList/PersonChat/PersonChat";
import {useFetchChatsInfiniteQuery} from "@/features/messenger/api/messengerApi";
import {useAppSelector} from "@/shared/lib/hooks/hooks";
import {selectSearchChatUserName} from "@/shared/api/appSlice";
import {useInfiniteScroll} from "@/shared/lib/hooks";
import {useEffect, useRef, useState} from "react";
import {useMeQuery} from "@/features/auth/api/authApi";
import {useDebouncedValue} from "@/shared/lib/hooks/useDebounce";
import {
    UniqOtherUsersWithoutChats
} from "@/features/messenger/ui/Messenger/ChatSideBar/ChatsList/UniqOtherUsersWithoutChats/UniqOtherUsersWithoutChats";

type Props = {
    activeUserIdChat: number | null
    setActiveUserIdChat: (activeChat: number) => void;
}

export const ChatsList = ({activeUserIdChat, setActiveUserIdChat}: Props) => {
    //первое значение searchChatUserName берется из appSlice
    const searchChatUserName = useAppSelector(selectSearchChatUserName)

    //Флаг, чтобы отрисовка otherUsers была только после получения данных о моих имеющихся чатах
    const [isChatsRendered, setIsChatsRendered] = useState(false)

    const debouncedSearch = useDebouncedValue(searchChatUserName)

    //Мои чаты, в которых была переписка
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

    useEffect(() => {
        if (data !== undefined) setIsChatsRendered(true)
    }, [data]);

    //Id юзеров с которыми у меня переписка
    const idsFromRenderedMyChats = new Set<number>()

    //Мои чаты-переписки для отрисовки
    const renderedMyChats = chats?.map((chat) => {
        const receiverId = (chat.receiverId === me?.userId) ? chat.ownerId : chat.receiverId //TODO: проверить

        //кладем id юзера, с которым есть переписка, в idsFromRenderedMyChats
        idsFromRenderedMyChats.add(receiverId)

        return <PersonChat key={chat.id}
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
            {chats && chats.length > 0 && renderedMyChats}

            {hasNextPage && (
                <div ref={observerRef} className={s.loadingWrapper}>
                    {isFetchingNextPage ? <div>Loading more ...</div> : <div style={{height: '2px'}}/>}
                </div>
            )}

            {isChatsRendered && <UniqOtherUsersWithoutChats
                activeUserIdChat={activeUserIdChat}
                setActiveUserIdChat={setActiveUserIdChat}
                userIdsFromMyChats={idsFromRenderedMyChats}
                isNeededToSkipRequest={hasNextPage}
                searchValue={debouncedSearch}/>}
        </div>
    )
};