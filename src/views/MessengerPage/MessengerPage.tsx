import s from './MessengerPage.module.scss'
import {ChatSideBar} from "@/views/MessengerPage/ChatSideBar/ChatSideBar";
import {ChatZone} from "@/views/MessengerPage/ChatZone/ChatZone";

export const MessengerPage = () => {
    return (
        <div className={s.messengerPageWrapper}>
            <div className={s.title}>Messenger</div>
            <div className={s.messengerBox}>
                <ChatSideBar/>
                <ChatZone/>
            </div>
        </div>
    );
};

