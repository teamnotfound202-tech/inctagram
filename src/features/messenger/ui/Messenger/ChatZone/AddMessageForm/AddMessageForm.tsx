import s
    from "./AddMessageForm.module.scss";
import {Button} from "@/shared/ui";
import {AlertToast} from "@/shared/ui/Alerts/Alerts";
import {useAppSelector} from "@/shared/lib/hooks/hooks";
import {selectCurrentMessages} from "@/shared/api/appSlice";
import {useState} from "react";

export const AddMessageForm = () => {
    const currentLanguage = useAppSelector(selectCurrentMessages);
    const [content, setContent] = useState(''); // состояние для input

    return (
        <form className={s.addMessageForm} /*onSubmit={handleSubmit}*/>
            <input
                className={s.addMessageInput}
                placeholder={currentLanguage.messenger.typeMessage}
                value={content}
               /* onChange={handleInputChange}
                disabled={isLoading} // отключаем во время загрузки*/
            />

            <Button
                variant="text"
                type="submit"
               /* disabled={isLoading || !content.trim()} // отключаем если загрузка или пустой input*/
            >
              {/*  {isLoading ? currentLanguage.posts.publishing : currentLanguage.posts.publish}*/}
                {currentLanguage.messenger.sendMessage}
            </Button>
           {/*


             Отображение ошибок
            {error && (
                <AlertToast description={'Ошибка при отправке ответа'}/>
            )}

            {isSuccess && (
                <AlertToast description={'Ответ успешно добавлен!'} variant={"success"}/>
            )}*/}
        </form>
    );
};