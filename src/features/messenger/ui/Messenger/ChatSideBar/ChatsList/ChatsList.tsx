import s from "./ChatsList.module.scss";
import {PersonChat} from "@/features/messenger/ui/Messenger/ChatSideBar/ChatsList/PersonChat/PersonChat";
import {useFetchChatsInfiniteQuery} from "@/features/messenger/api/messengerApi";
import {useAppSelector} from "@/shared/lib/hooks/hooks";
import {selectSearchChatUserName} from "@/shared/api/appSlice";
import {useInfiniteScroll} from "@/shared/lib/hooks";
import {useEffect, useRef, useState} from "react";
import {useMeQuery} from "@/features/auth/api/authApi";
import {useGetSearchUserInfiniteQuery} from "@/features/publicUserApi/publicUserApi";

type Props = {
    activeUserIdChat: number | null
    setActiveUserIdChat: (activeChat: number) => void;
}

export const ChatsList = ({activeUserIdChat, setActiveUserIdChat}: Props) => {
    //первое значение searchChatUserName берется из appSlice
    const searchChatUserName = useAppSelector(selectSearchChatUserName)

    // Debounced версия search. В запросах useFetchChatsInfiniteQuery используем уже debouncedSearch
    const [debouncedSearch, setDebouncedSearch] = useState(searchChatUserName)

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchChatUserName)
        }, 400) // 400ms задержка

        return () => clearTimeout(timer)
    }, [searchChatUserName])

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

    //Id юзеров с которыми у меня переписка
    const idsFromRenderedMyChats = new Set()

    //Мои чаты-переписки для отрисовки
    const renderedMyChats = chats?.map((chat) => {
        const receiverId = (chat.receiverId === me?.userId) ? chat.ownerId : chat.receiverId //TODO: проверить

        //кладем id юзера, с которым есть переписка, в idsFromRenderedMyChats
        idsFromRenderedMyChats.add(receiverId)

        return <PersonChat key={receiverId}
                           avatar={(chat?.avatars?.length > 0) ? chat?.avatars[0]?.url : ''}
                           name={chat?.userName}
                           dateTime={chat?.createdAt}
                           message={chat?.messageText}
                           personChatClickHandler={() => setActiveUserIdChat(receiverId)}
                           isActive={activeUserIdChat === chat.receiverId}
        />
    })

    //Пользователи, с которыми нет переписок, но нужно отобразить в списке, чтоб можно было им написать

    const {data: otherUsers/*, hasNextPage, isFetching, isLoading, fetchNextPage*/} = useGetSearchUserInfiniteQuery(
        {search: debouncedSearch},
        {skip: hasNextPage, refetchOnMountOrArgChange: true}    )

    //отфильтруем, чтобы не показывать себя в списке
    const searchOtherUsers = otherUsers?.pages.flatMap(page => page.items).filter(user => user.id !== me?.userId)

    // Убираем дублирующиеся чаты

    /*  const idsFromRenderedMyChats = new Set(chats?.map((chat) => {
              const receiverId = (chat.receiverId === me?.userId) ? chat.ownerId : chat.receiverId //TODO: проверить
              return receiverId
          })
      )*/

    const otherUsersWithoutDoubles = searchOtherUsers?.filter(user => !idsFromRenderedMyChats.has(user.id))

    //Users, с которыми еще не было переписки, но которым можно написать
    const renderedOtherUsers = otherUsersWithoutDoubles?.map((user) => {
        return <PersonChat key={user?.id}
                           avatar={(user?.avatars?.length > 0) ? user?.avatars[0]?.url : ''}
                           name={user?.userName}
                           personChatClickHandler={() => setActiveUserIdChat(user?.id)}
                           isActive={activeUserIdChat === user?.id}
        />
    })

    return (
        <div className={s.personsChatsList} ref={scrollRef}>
            {chats && chats.length > 0 && renderedMyChats}

            {/*{chats && chats.length === 0 ? (
                <p>There are no chats</p>
            ) : hasNextPage} //TODO: удалить, оставила для теста, чтобы не поломалось*/}

            {hasNextPage && (
                <div ref={observerRef} className={s.loadingWrapper}>
                    {isFetchingNextPage ? <div>Loading more ...</div> : <div style={{height: '2px'}}/>}
                </div>
            )}

            {renderedOtherUsers?.length > 0 && <>
                <div>Other users to chat</div>
                {renderedOtherUsers}
            </>}
        </div>
    )
};