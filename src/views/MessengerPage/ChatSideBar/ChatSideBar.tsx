import s from "./ChatSideBar.module.scss";
import {ChatSearchForm} from "@/views/MessengerPage/ChatSideBar/ChatSearchForm/ChatSearchForm";
import {ChatsList} from "@/views/MessengerPage/ChatSideBar/ChatsList/ChatsList";

export const ChatSideBar = () => {
    return (
        <div className={s.allChats}>
            <ChatSearchForm/>
            <ChatsList/>
        </div>
    )
        ;
};