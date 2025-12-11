import s from './ChatZone.module.scss'
import {ViewMessagesZone} from "@/features/messenger/ui/Messenger/ChatZone/ViewMessagesZone/ViewMessagesZone";
import {AddMessageForm} from "@/features/messenger/ui/Messenger/ChatZone/AddMessageForm/AddMessageForm";
import {EmptyChatZone} from "@/features/messenger/ui/Messenger/ChatZone/EmptyChatZone/EmptyChatZone";
import {
    ChatPersonTitleWrapper
} from "@/features/messenger/ui/Messenger/ChatZone/ChatPersonTitleWrapper/ChatPersonTitleWrapper";

type Props = {
    activeUserIdChat: number | null
}

export const ChatZone = ({activeUserIdChat}: Props) => {
    return (
        <div className={s.chatZone}>
            {activeUserIdChat && <>
                <ChatPersonTitleWrapper activeUserIdChat={activeUserIdChat}/>
                <ViewMessagesZone activeUserIdChat={activeUserIdChat}/>
                <AddMessageForm activeUserIdChat={activeUserIdChat}/>
            </>}
            {!activeUserIdChat && <EmptyChatZone/>}
        </div>
    );
};