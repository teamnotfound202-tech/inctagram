import s from "./Messenger.module.scss";
import {ChatSideBar} from "@/features/messenger/ui/Messenger/ChatSideBar/ChatSideBar";
import {ChatZone} from "@/features/messenger/ui/Messenger/ChatZone/ChatZone";
import {useState} from "react";

export const Messenger = () => {
    const [activeUserIdChat, setActiveUserIdChat] = useState<number | null>(null)
    const [searchName, setSearchName] = useState("");

    return (
        <div className={s.messengerBox}>
            <ChatSideBar
                setActiveUserIdChat={setActiveUserIdChat}
                activeUserIdChat={activeUserIdChat}
                searchName={searchName}
                setSearchName={setSearchName}
            />
            <ChatZone
                activeUserIdChat={activeUserIdChat}
                searchName={searchName}
            />
        </div>
    );
};