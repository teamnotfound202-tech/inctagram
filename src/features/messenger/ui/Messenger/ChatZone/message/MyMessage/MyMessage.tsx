import {MessageStatus} from '@/features/messenger/api/types';
import s from './MyMessage.module.scss'
import {getTimeDifference} from "@/shared/lib/utils/getTimeDifference";
import {ISOStringFormat} from "date-fns";
import {useAppSelector} from "@/shared/lib/hooks/hooks";
import {selectLanguage} from "@/shared/api/appSlice";
import {formatRelativeDate} from "@/shared/lib/utils/formatRelativeDate";

type Props = {
    text: string;
    createdAt: ISOStringFormat;
    updatedAt: ISOStringFormat;
    status: string;
}
export const MyMessage = ({text, createdAt, updatedAt, status}: Props) => {
    const language = useAppSelector(selectLanguage)

    const sendMessageTime = formatRelativeDate(createdAt, language);//TODO: отредактировать формат даты, lдобавить время
    const updateMessageTime = formatRelativeDate(updatedAt, language);//TODO: отредактировать формат даты, lдобавить время

        const createdTime = new Date(createdAt).toLocaleTimeString()//TODO: отредактировать формат даты

        let renderedMessageStatus: string = ''; ///TODO: добавить svg галочки вместо слов
        switch (status) {
            case MessageStatus.RECEIVED :
                renderedMessageStatus = 'Получено'
                break;
            case MessageStatus.SENT :
                renderedMessageStatus = 'Отправлено'
                break;
            case MessageStatus.READ:
                renderedMessageStatus = 'Прочитано'
                break;
            default:
                renderedMessageStatus = '';
        }

        const isMessageUpdated = createdAt !== updatedAt

        return (
            <div className={s.messageWrapper}>
                <div className={s.messageText}>
                    {text}
                </div>
                <div className={s.messageMetaInf}>
                    <span className={s.lastMessageTime}>{sendMessageTime}</span>
                    <span className={s.lastMessageTime}>{createdTime}</span>
                    {isMessageUpdated && <span className={s.lastMessageTime}>Изменено {updateMessageTime}</span>}
                    <span className={s.lastMessageTime}>{renderedMessageStatus}</span>
                </div>
            </div>
        );
    }
;