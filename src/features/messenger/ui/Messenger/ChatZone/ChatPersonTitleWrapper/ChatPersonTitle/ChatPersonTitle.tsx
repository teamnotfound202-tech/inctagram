import s from "./ChatPersonTitle.module.scss";
import {Avatar} from "@/entities/user/ui/Avatar";
import {useFetchInfinityChatsInfiniteQuery} from "@/features/messenger/api/messengerApi";

type Props = {
    activeUserIdChat: number
}

export const ChatPersonTitle = ({activeUserIdChat}: Props) => {
    const {data} = useFetchInfinityChatsInfiniteQuery({})
    const chat = data?.pages.flatMap(page => page.items)
        .filter(chat => chat.receiverId === activeUserIdChat)
    console.log('chat ', chat)

    return (
        activeUserIdChat && chat && <>
            <Avatar src={chat[0]?.avatars[0]?.url} alt="avatar"/>
            <span className={s.messageAuthorName}>{chat[0].userName}</span>
        </>

    );
};