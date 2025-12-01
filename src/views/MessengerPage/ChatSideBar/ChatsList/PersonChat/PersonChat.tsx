import s from "./PersonChat.module.scss";
import {Avatar} from "@/entities/user/ui/Avatar";

type Props = {
    avatar: string
    name: string
    dateTime: string
    message: string
}

export const PersonChat = ({avatar, name, dateTime, message}: Props) => {
    return (
        <div className={s.personChatWrapper}>
            <Avatar alt="avatar"/>
            <div className={s.personChat}>
                <span className={s.messageAuthorName}>{name}</span>
                <p className={s.chatLastMessage}>{message}</p>
            </div>
            <div className={s.lastMessageTime}>{dateTime}</div>
        </div>
    );
};