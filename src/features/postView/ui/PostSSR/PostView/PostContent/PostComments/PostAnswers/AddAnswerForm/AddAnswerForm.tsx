'use client'
import {useAppSelector} from '@/shared/lib/hooks/hooks';
import {useState} from 'react';
import {selectCurrentMessages} from "@/shared/api/appSlice";
import s from "./AddAnswerForm.module.scss";
import {Button} from "@/shared/ui";
import {AlertToast} from "@/shared/ui/Alerts/Alerts";
import {useCreateAnswerMutation} from "@/features/posts/api/posts-api";
import {From} from "@/features/publicUserApi/types";

type AddCommentFormProps = {
    postId: number, // ID поста, к которому добавляется комментарий
    commentId: number, // ID поста, к которому добавляется комментарий
    user: From      //user типа From (т.к. для оптимистичного update нужна вся структура типа From)
}

export const AddAnswerForm = ({postId, user, commentId}: AddCommentFormProps) => {
    const currentLanguage = useAppSelector(selectCurrentMessages);
    const [content, setContent] = useState(''); // состояние для input
    const [createAnswer, {isLoading, error, isSuccess}] = useCreateAnswerMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) {
            return;
        }

        createAnswer({
            postId,
            commentId,
            user,
            content: content.trim()
        })
        setContent('');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContent(e.target.value);
    };

    return (
        <form className={s.addCommentForm} onSubmit={handleSubmit}>
            <input
                className={s.createCommentInput}
                placeholder={currentLanguage.posts.addAnswer}
                value={content}
                onChange={handleInputChange}
                disabled={isLoading} // отключаем во время загрузки
            />
            <Button
                variant="text"
                type="submit"
                disabled={isLoading || !content.trim()} // отключаем если загрузка или пустой input
            >
                {isLoading ? currentLanguage.posts.publishing : currentLanguage.posts.publish}
            </Button>

            {/* Отображение ошибок */}
            {error && (
                <AlertToast description={'Ошибка при отправке ответа'}/>//TODO: нужно пофиксить тосты
            )}

            {isSuccess && (
                <AlertToast description={'Ответ успешно добавлен!'} variant={"success"}/>
            )}
        </form>
    );
};
