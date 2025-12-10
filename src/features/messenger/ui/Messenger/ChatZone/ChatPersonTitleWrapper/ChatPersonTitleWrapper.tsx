import s from "./ChatPersonTitleWrapper.module.scss";
import {ChatPersonTitle} from "@/features/messenger/ui/Messenger/ChatZone/ChatPersonTitleWrapper/ChatPersonTitle/ChatPersonTitle";

type Props = {
    activeUserIdChat: number | null
}

export const ChatPersonTitleWrapper = ({activeUserIdChat}: Props) => {
    return (
        <div className={s.chatPersonTitleWrapper}>
            {activeUserIdChat && <ChatPersonTitle activeUserIdChat={activeUserIdChat} />}
        </div>
    );
};