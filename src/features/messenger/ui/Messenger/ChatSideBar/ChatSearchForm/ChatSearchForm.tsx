import s from "./ChatSearchForm.module.scss";
import {useAppSelector} from "@/shared/lib/hooks/hooks";
import {selectCurrentMessages} from "@/shared/api/appSlice";
import Search from './icons/search.svg'
import {ChangeEvent} from "react";

type Props = {
    searchName: string
    changeSearchName: (searchName: string) => void
}

export const ChatSearchForm = ({searchName, changeSearchName}: Props) => {
    const messages = useAppSelector(selectCurrentMessages)
    const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        changeSearchName(e.currentTarget.value)
    }

    return (
        <div className={s.search}>
            <div className={s.inputWrapper}>
                <input className={s.chatSearchInput}
                       type="search"
                       value={searchName}
                       onChange={changeHandler}
                       placeholder={messages.messenger.inputSearch}/>
                <div className={s.iconWrapper}><Search/></div>
            </div>
        </div>
    );
};