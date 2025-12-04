import {useAppSelector} from "@/shared/lib/hooks/hooks";
import {selectCurrentMessages} from "@/shared/api/appSlice";
import s from './EmptyChatZone.module.scss'

export const EmptyChatZone = () => {
    const messages = useAppSelector(selectCurrentMessages)
    return (
        <div className={s.emptyChatZone}>
            <div className={s.emptyChatZoneBlock}>
            {messages.messenger.emptyChatZone}
            </div>
        </div>
    );
};