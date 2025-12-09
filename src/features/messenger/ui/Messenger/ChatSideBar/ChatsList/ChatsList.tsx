import s from "./ChatsList.module.scss";
import {PersonChat} from "@/features/messenger/ui/Messenger/ChatSideBar/ChatsList/PersonChat/PersonChat";
import {useFetchChatsInfiniteQuery} from "@/features/messenger/api/messengerApi";
import {Loader} from "@/shared/ui/Loader/Loader";

type Props = {
    activeUserIdChat: number | null
    setActiveUserIdChat: (activeChat: number) => void;
    searchName: string;
}

export const ChatsList = ({activeUserIdChat, setActiveUserIdChat, searchName}: Props) => {
    const {data, isLoading} = useFetchChatsInfiniteQuery({searchName})

    const chats = data?.pages.flatMap(page => page.items)

    if (isLoading) return <Loader/>

    const renderedChats = chats?.map((chat) => {

        return <PersonChat key={chat.id}
                           avatar={chat.avatars[0]?.url}
                           name={chat.userName}
                           dateTime={chat.createdAt}
                           message={chat.messageText}
                           personChatClickHandler={() => setActiveUserIdChat(chat.receiverId)}
                           isActive={activeUserIdChat === chat.receiverId}
        />
    })

    return (
        <div className={s.personsChatsList}>
            {renderedChats}
        </div>
    )
};