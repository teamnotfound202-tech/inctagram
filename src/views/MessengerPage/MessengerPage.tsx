import s from './MessengerPage.module.scss'
import {Messenger} from "@/features/messenger";


export const MessengerPage = () => {
    return (
        <div className={s.messengerPageWrapper}>
            <div className={s.title}>Messenger</div>
            <Messenger/>
        </div>
    );
};

