import s from "./ChatSideBar.module.scss";
import {ChatSearchForm} from "@/features/messenger/ui/Messenger/ChatSideBar/ChatSearchForm/ChatSearchForm";
import {ChatsList} from "@/features/messenger/ui/Messenger/ChatSideBar/ChatsList/ChatsList";

type Props = {
    activeUserIdChat: number | null;
    setActiveUserIdChat: (activeChat: number) => void;
}

export const ChatSideBar = ({activeUserIdChat, setActiveUserIdChat}: Props) => {
    return (
        <div className={s.allChats}>
            <ChatSearchForm/>
            <ChatsList
                activeUserIdChat={activeUserIdChat}
                setActiveUserIdChat={setActiveUserIdChat}
            />
        </div>
    )
};