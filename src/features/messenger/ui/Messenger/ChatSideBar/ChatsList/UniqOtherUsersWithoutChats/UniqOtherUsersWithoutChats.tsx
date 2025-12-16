import {PersonChat} from "@/features/messenger/ui/Messenger/ChatSideBar/ChatsList/PersonChat/PersonChat";
import {useGetSearchUserInfiniteQuery} from "@/features/publicUserApi/publicUserApi";
import {useMeQuery} from "@/features/auth/api/authApi";

type Props = {
    searchValue: string,
    userIdsFromMyChats: Set<number>,
    isNeededToSkipRequest: boolean, //если много своих чатов
    activeUserIdChat: number | null
    setActiveUserIdChat: (activeChat: number) => void;
};
export const UniqOtherUsersWithoutChats = ({
                                               searchValue,
                                               userIdsFromMyChats,
                                               isNeededToSkipRequest,
                                               activeUserIdChat,
                                               setActiveUserIdChat,
                                           }: Props) => {
    //Пользователи, с которыми нет переписок, но нужно отобразить в списке, чтоб можно было им написать
    const {data: otherUsers/*, hasNextPage, isFetching, isLoading, fetchNextPage*/} = useGetSearchUserInfiniteQuery(
        {search: searchValue},
        {skip: isNeededToSkipRequest, refetchOnMountOrArgChange: true}) //TODO: доделать infinityScroll

    const {data: me} = useMeQuery()

    //отфильтруем, чтобы не показывать себя в списке
    const searchOtherUsers = otherUsers?.pages.flatMap(page =>
        page.items).filter(user => user.id !== me?.userId)

    // Убираем дублирующиеся чаты
    const otherUsersWithoutDoubles = searchOtherUsers?.filter(user =>
        !userIdsFromMyChats.has(user.id))

    return (<>
            {otherUsersWithoutDoubles && otherUsersWithoutDoubles?.length > 0 && <>
                <div>Other users to chat</div>
                {otherUsersWithoutDoubles?.map((user) => {
                    return <PersonChat key={user?.id}
                                       avatar={(user?.avatars?.length > 0) ? user?.avatars[0]?.url : ''}
                                       name={user?.userName}
                                       personChatClickHandler={() => setActiveUserIdChat(user?.id)}
                                       isActive={activeUserIdChat === user?.id}
                    />
                })}
            </>}
        </>
    )
};