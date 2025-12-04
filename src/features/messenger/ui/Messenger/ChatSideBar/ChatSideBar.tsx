import s from "./ChatSideBar.module.scss";
import {ChatSearchForm} from "@/features/messenger/ui/Messenger/ChatSideBar/ChatSearchForm/ChatSearchForm";
import {ChatsList} from "@/features/messenger/ui/Messenger/ChatSideBar/ChatsList/ChatsList";
import {useState} from "react";

type Props = {
    setActiveUserIdChat: (activeChat: number) => void;
    activeUserIdChat: number | null;
}

export const ChatSideBar = ({activeUserIdChat, setActiveUserIdChat}: Props) => {
    const [searchName, setSearchName] = useState("");
    return (
        <div className={s.allChats}>
            <ChatSearchForm searchName={searchName} changeSearchName={setSearchName}/>
            <ChatsList
                activeUserIdChat={activeUserIdChat}
                setActiveUserIdChat={setActiveUserIdChat}
                searchName={searchName}
            />
        </div>
    )
        ;
};