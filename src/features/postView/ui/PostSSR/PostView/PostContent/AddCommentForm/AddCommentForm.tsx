'use client'
import {useAppSelector} from '@/shared/lib/hooks/hooks';
import {useState} from 'react';
import {selectCurrentMessages} from "@/shared/api/appSlice";
import s from "./AddCommentForm.module.scss";
import {Button} from "@/shared/ui";
import {From} from "@/features/postView/api/types";
import {AlertToast} from "@/shared/ui/Alerts/Alerts";
import {useCreateCommentMutation} from "@/features/posts/api/posts-api";
import {toast} from "sonner";

type AddCommentFormProps = {
    postId: number, // ID поста, к которому добавляется комментарий
    user: From      //user типа From (т.к. для оптимистичного update нужна вся структура типа From)
}

export const AddCommentForm = ({postId, user}: AddCommentFormProps) => {
    const currentLanguage = useAppSelector(selectCurrentMessages);
    const [content, setContent] = useState(''); // состояние для input
    const [createComment, {isLoading, error, isSuccess}] = useCreateCommentMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) {
            return;
        }

        createComment({
            postId,
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
                toast.custom(() => (
                    <AlertToast description={'Ошибка при отправке комментария'}/>
                ))
            )}

            {isSuccess && (
                toast.custom(() => (
                    <AlertToast description={'Комментарий успешно добавлен!'} variant={"success"}/>
                ))
            )}
        </form>
    );
};
