/*
import s from "./AddCommentForm.module.scss";
import {Button} from "@/shared/ui";
import {useAppSelector} from "@/shared/lib/hooks/hooks";
import {selectCurrentMessages} from "@/shared/api/appSlice";

export const AddCommentForm = () => {
    const currentLanguage = useAppSelector(selectCurrentMessages)
    return (
        <form className={s.addCommentForm}>
            <input className={s.createCommentInput} placeholder={currentLanguage.posts.addComment}/>
            <Button variant={"text"}>{currentLanguage.posts.publish}</Button>
        </form>
    );
};*/
'use client'
import { useAppSelector } from '@/shared/lib/hooks/hooks';
import { useState } from 'react';
import {selectCurrentMessages} from "@/shared/api/appSlice";
import {useCreateCommentMutation} from "@/features/postView/api/postApi";
import s from "./AddCommentForm.module.scss";
import {Button} from "@/shared/ui";
import {From} from "@/features/postView/api/types";
import {AlertToast} from "@/shared/ui/Alerts/Alerts";

interface AddCommentFormProps {
    postId: number, // ID поста, к которому добавляется комментарий
    user: From
}

export const AddCommentForm = ({ postId, user }: AddCommentFormProps) => {
    const currentLanguage = useAppSelector(selectCurrentMessages);
    const [content, setContent] = useState(''); // состояние для input
    const [createComment, { isLoading, error, isSuccess }] = useCreateCommentMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) {
            return;
        }

        try {
            await createComment({
                postId,
                user,
                content: content.trim()
            }).unwrap();

            setContent('');
        } catch (err) {
            console.error('Failed to create comment:', err);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContent(e.target.value);
    };

    return (
        <form className={s.addCommentForm} onSubmit={handleSubmit}>
            <input
                className={s.createCommentInput}
                placeholder={currentLanguage.posts.addComment}
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
                <AlertToast description={'Ошибка при отправке комментария'}/>
                /*<div className={s.error}>

                    {/!*!//TODO: добваить тосты*!/}
                    Ошибка при отправке комментария
                </div>*/
            )}

            {/* Успешное сообщение (опционально) */}
            {isSuccess && (
                <AlertToast description={'Комментарий успешно добавлен!'} variant={"success"}/>
                /*<div className={s.success}>

                    Комментарий успешно добавлен!
                </div>*/
            )}
        </form>
    );
};
