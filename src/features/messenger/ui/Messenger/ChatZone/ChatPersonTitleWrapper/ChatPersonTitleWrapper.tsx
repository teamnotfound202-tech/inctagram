import s from "./ChatPersonTitleWrapper.module.scss";
import {ChatPersonTitle} from "@/features/messenger/ui/Messenger/ChatZone/ChatPersonTitleWrapper/ChatPersonTitle/ChatPersonTitle";

type Props = {
    activeUserIdChat: number | null
    searchName: string
}

export const ChatPersonTitleWrapper = ({activeUserIdChat, searchName}: Props) => {
    return (
        <div className={s.chatPersonTitleWrapper}>
            {activeUserIdChat && <ChatPersonTitle activeUserIdChat={activeUserIdChat} searchName={searchName}/>}
        </div>
    );
};