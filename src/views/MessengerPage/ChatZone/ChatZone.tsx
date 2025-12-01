import s from './ChatZone.module.scss'
import {AddMessageForm} from "@/views/MessengerPage/ChatZone/AddMessageForm/AddMessageForm";
import {ChatPersonTitle} from "@/views/MessengerPage/ChatZone/ChatPersonTitle/ChatPersonTitle";
import {ViewMessagesZone} from "@/views/MessengerPage/ChatZone/ViewMessagesZone/ViewMessagesZone";

export const ChatZone = () => {
    return (
        <div className={s.chatZone}>
            <ChatPersonTitle/>
            <ViewMessagesZone/>
            <AddMessageForm/>
        </div>
    );
};