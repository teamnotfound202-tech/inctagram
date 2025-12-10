import s from "./ChatSearchForm.module.scss";
import {useAppDispatch, useAppSelector} from "@/shared/lib/hooks/hooks";
import {changeSearchChatUserName, selectCurrentMessages, selectSearchChatUserName} from "@/shared/api/appSlice";
import Search from './icons/search.svg'
import {ChangeEvent} from "react";

export const ChatSearchForm = () => {
    const messages = useAppSelector(selectCurrentMessages)
    const searchChatUserName = useAppSelector(selectSearchChatUserName)
    const dispatch = useAppDispatch();
    const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch(changeSearchChatUserName({searchChatUserName: e.currentTarget.value}))
    }

    return (
        <div className={s.search}>
            <div className={s.inputWrapper}>
                <input className={s.chatSearchInput}
                       type="search"
                       value={searchChatUserName}
                       onChange={changeHandler}
                       placeholder={messages.messenger.inputSearch}/>
                <div className={s.iconWrapper}><Search/></div>
            </div>
        </div>
    );
};