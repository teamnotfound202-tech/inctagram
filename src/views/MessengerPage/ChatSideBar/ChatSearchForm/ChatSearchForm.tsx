import s from "./ChatSearchForm.module.scss";
import {useAppSelector} from "@/shared/lib/hooks/hooks";
import {selectCurrentMessages} from "@/shared/api/appSlice";
import Search from './icons/search.svg'

export const ChatSearchForm = () => {
    const messages = useAppSelector(selectCurrentMessages)
    return (
        <div className={s.search}>
            <div className={s.inputWrapper}>
                <input className={s.chatSearchInput} type="search"
                       placeholder={messages.messenger.inputSearch}></input>
                <div className={s.iconWrapper}><Search /></div>
            </div>
        </div>
    );
};