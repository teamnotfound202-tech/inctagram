import s from './NotMyMessage.module.scss'
import {getTimeDifference} from "@/shared/lib/utils/getTimeDifference";
import {Avatar} from "@/entities/user/ui/Avatar";

type Props = {
    text: string;
    dateTime: string;
}
export const NotMyMessage = ({text, dateTime}: Props) => {
        const sendMessageTime = getTimeDifference(dateTime); //TODO: отредактировать формат даты

        return (
            <div className={s.messageWrapper}>
                <Avatar alt={'avatar'}/>
                <div className={s.messageBlockWrapper}>
                    <div className={s.messageText}>{text}</div>
                    <div className={s.messageMetaInf}>
                        <span className={s.lastMessageTime}>{sendMessageTime}</span>
                    </div>
                </div>
            </div>
        );
    }
;