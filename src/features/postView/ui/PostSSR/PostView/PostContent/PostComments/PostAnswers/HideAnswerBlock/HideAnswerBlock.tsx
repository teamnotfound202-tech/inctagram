import s from './HideAnswerBlock.module.scss'
import {useAppSelector} from "@/shared/lib/hooks/hooks";
import {selectCurrentMessages} from "@/shared/api/appSlice";

type Props = {
    answersCount:number;
    setIsAnswersOpened: (value: false)=>void
};
export const HideAnswerBlock = ({answersCount, setIsAnswersOpened}: Props) => {
    const currentLanguage = useAppSelector(selectCurrentMessages)

    const onAnswersHide = () => {
        setIsAnswersOpened(false)
    }

    return (
        <div className={s.textWrapper} onClick={onAnswersHide}>
            <div className={s.text}>{`${currentLanguage.posts.hideAnswersCount} (${answersCount})`}</div>
        </div>
    );
};