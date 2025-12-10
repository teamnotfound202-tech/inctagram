import s from "./ChatPersonTitle.module.scss";
import {Avatar} from "@/entities/user/ui/Avatar";
import {useFetchChatsInfiniteQuery} from "@/features/messenger/api/messengerApi";
import {useAppSelector} from "@/shared/lib/hooks/hooks";
import {selectSearchChatUserName} from "@/shared/api/appSlice";

type Props = {
    activeUserIdChat: number
}

export const ChatPersonTitle = ({activeUserIdChat}: Props) => {
    const searchChatUserName = useAppSelector(selectSearchChatUserName)
    const {data} = useFetchChatsInfiniteQuery({searchName: searchChatUserName})
    const chat = data?.pages.flatMap(page => page.items)
        .filter(chat => chat.receiverId === activeUserIdChat)

    return (
        activeUserIdChat && chat && <>
            <Avatar src={chat[0]?.avatars[0]?.url} alt="avatar"/>
            <span className={s.messageAuthorName}>{chat[0]?.userName}</span>
        </>

    );
};