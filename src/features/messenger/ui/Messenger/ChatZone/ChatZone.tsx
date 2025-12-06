import s from './ChatZone.module.scss'
import {ViewMessagesZone} from "@/features/messenger/ui/Messenger/ChatZone/ViewMessagesZone/ViewMessagesZone";
import {AddMessageForm} from "@/features/messenger/ui/Messenger/ChatZone/AddMessageForm/AddMessageForm";
import {EmptyChatZone} from "@/features/messenger/ui/Messenger/ChatZone/EmptyChatZone/EmptyChatZone";
import {
    ChatPersonTitleWrapper
} from "@/features/messenger/ui/Messenger/ChatZone/ChatPersonTitleWrapper/ChatPersonTitleWrapper";

type Props = {
    activeUserIdChat: number | null
    searchName: string
}

export const ChatZone = ({activeUserIdChat, searchName}: Props) => {
    return (
        <div className={s.chatZone}>
            <ChatPersonTitleWrapper activeUserIdChat={activeUserIdChat} searchName={searchName}/>
            {activeUserIdChat && <>
                <ViewMessagesZone activeUserIdChat={activeUserIdChat}/>
            </>}
            {!activeUserIdChat && <EmptyChatZone/>}
            {activeUserIdChat &&<AddMessageForm activeUserIdChat={activeUserIdChat}/>}
        </div>
    );
};