import s
    from "./AddMessageForm.module.scss";
import {Button} from "@/shared/ui";
import {AlertToast} from "@/shared/ui/Alerts/Alerts";
import {useAppSelector} from "@/shared/lib/hooks/hooks";
import {selectCurrentMessages} from "@/shared/api/appSlice";
import {useState} from "react";
import {useSendMessageMutation} from "@/features/messenger/api/messengerApi";

export const AddMessageForm = () => {
    const currentLanguage = useAppSelector(selectCurrentMessages);
    const [content, setContent] = useState(''); // состояние для input
    const [sendMessage, {isLoading, error}] = useSendMessageMutation()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) {
            return;
        }

        sendMessage({
            text: content.trim(),
            receiverId: 77      //TODO: убрать хардкод
        })
        setContent('');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContent(e.target.value);
    };

    return (
        <form className={s.addMessageForm} onSubmit={handleSubmit}>
            <input
                className={s.addMessageInput}
                placeholder={currentLanguage.messenger.typeMessage}
                value={content}
                onChange={handleInputChange}
                //disabled={isLoading}
            />

            <Button
                variant="text"
                type="submit"
                //disabled={isLoading || !content.trim()} // отключаем если загрузка или пустой input
            >
                {isLoading ? currentLanguage.messenger.sendingMessage : currentLanguage.messenger.sendMessage}
            </Button>

            {/* //Отображение ошибок*/}
            {error && (
                <AlertToast description={'Ошибка при отправке ответа'}/>
            )}
        </form>
    );
};