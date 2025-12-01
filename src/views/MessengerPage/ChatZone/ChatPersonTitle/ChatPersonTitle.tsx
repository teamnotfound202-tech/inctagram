
import s from "./ChatPersonTitle.module.scss";
import {Avatar} from "@/entities/user/ui/Avatar";


export const ChatPersonTitle = () => {
    return (
        <div className={s.chatPersonTitle}>
            <Avatar alt="avatar"/>
            <span className={s.messageAuthorName}>Ирина Иванова</span>
        </div>
    );
};