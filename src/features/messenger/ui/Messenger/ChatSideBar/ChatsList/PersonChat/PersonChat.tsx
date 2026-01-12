import s from './PersonChat.module.scss'
import { Avatar } from '@/entities/user/ui/Avatar'
import { formatRelativeDate } from '@/shared/lib/utils/formatRelativeDate'
import { selectLanguage } from '@/shared/api/appSlice'
import { useAppSelector } from '@/shared/lib/hooks/hooks'

type Props = {
    avatar: string
    name: string
    dateTime: string
    message: string
    personChatClickHandler: () => void;
    isActive: boolean;
}

export const PersonChat = ({avatar, name, dateTime, message, personChatClickHandler, isActive}: Props) => {
    const language = useAppSelector(selectLanguage)

    const date = formatRelativeDate(dateTime, language);

    return (
        <div className={s.personChatWrapper + ' ' + (isActive ? s.active : '')}
             onClick={personChatClickHandler}>
            <Avatar src={avatar} alt="avatar"/>
            <div className={s.personChat}>
                <span className={s.messageAuthorName}>{name}</span>
                <p className={s.chatLastMessage}>{message}</p>
            </div>
            <div className={s.lastMessageTime}>{date}</div>
        </div>
    );
};