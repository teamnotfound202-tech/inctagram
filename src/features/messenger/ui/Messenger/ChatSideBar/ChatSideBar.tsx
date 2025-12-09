import s from "./ChatSideBar.module.scss";
import {ChatSearchForm} from "@/features/messenger/ui/Messenger/ChatSideBar/ChatSearchForm/ChatSearchForm";
import {ChatsList} from "@/features/messenger/ui/Messenger/ChatSideBar/ChatsList/ChatsList";

type Props = {
    activeUserIdChat: number | null;
    setActiveUserIdChat: (activeChat: number) => void;
    searchName: string
    setSearchName: (searchName: string) => void;
}

export const ChatSideBar = ({activeUserIdChat, setActiveUserIdChat, searchName, setSearchName}: Props) => {

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