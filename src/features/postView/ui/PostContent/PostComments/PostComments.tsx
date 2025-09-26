import s from './PostComments.module.scss';
import {PostComment} from "@/features/postView/ui/PostContent/PostComments/PostComment/PostComment";

type Props = {
    avatarOwner:string
};
export const PostComments = ({avatarOwner}: Props) => {
    return (
        <div className={s.commentsWrapper}>
            <PostComment avatarOwner={avatarOwner}/>
        </div>
    );
};