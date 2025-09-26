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
};