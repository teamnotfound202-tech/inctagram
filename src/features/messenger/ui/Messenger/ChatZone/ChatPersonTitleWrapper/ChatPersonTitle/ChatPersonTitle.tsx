import s from "./ChatPersonTitle.module.scss";
import {Avatar} from "@/entities/user/ui/Avatar";
import {useFetchChatsInfiniteQuery} from "@/features/messenger/api/messengerApi";

type Props = {
    activeUserIdChat: number
    searchName: string
}

export const ChatPersonTitle = ({activeUserIdChat, searchName}: Props) => {
    const {data} = useFetchChatsInfiniteQuery({searchName})
    const chat = data?.pages.flatMap(page => page.items)
        .filter(chat => chat.receiverId === activeUserIdChat)

    return (
        activeUserIdChat && chat && <>
            <Avatar src={chat[0]?.avatars[0]?.url} alt="avatar"/>
            <span className={s.messageAuthorName}>{chat[0].userName}</span>
        </>

    );
};