import s from './CommonError.module.scss'
import {Button} from "@/shared/ui";

export const CommonError = () => {
    return (
        <div className={s.mainWrapper}>
            <h1>Упс... Что-то пошло не так.</h1>
            <Button variant={'primary'}>
                <a href={'/'}>Вернуться на главную</a>
            </Button>
        </div>
    );
};