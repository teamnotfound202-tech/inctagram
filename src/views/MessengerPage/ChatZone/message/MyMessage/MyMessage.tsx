import s from './MyMessage.module.scss'
import {getTimeDifference} from "@/shared/lib/utils/getTimeDifference";

type Props = {
    text: string;
    dateTime: string;
    isRead: boolean;
}
export const MyMessage = ({text, dateTime, isRead}: Props) => {
        const sendMessageTime = getTimeDifference(dateTime); //TODO: отредактировать формат даты

        return (
            <div className={s.messageWrapper}>
                <div className={s.messageText}>
                    {text}
                </div>
                <div className={s.messageMetaInf}>
                    <span className={s.lastMessageTime}>{sendMessageTime}</span>
                    {isRead && <span>Прочитано</span>}
                    {!isRead && <span>Не прочитано</span>}
                </div>
            </div>
        );
    }
;