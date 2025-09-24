import {Post} from "@/features/postView/api/types";
import Avatar from "@/entities/user/ui/Avatar/Avatar";
import s from "@/features/postView/ui/PostContent/PostContent.module.scss"
import {Button} from "@/shared/ui";

type Props = {
    post: Post
};
export const PostContent = ({post}: Props) => {
    return (
        <div className={s.postContentWrapper}>
            <div className={s.postTitle}>
                <Avatar src={post.avatarOwner} alt={'avatar'}/>
                <div className={s.ownerName}>{post && post.userName}</div>
            </div>

            <div className={s.commentsWrapper}>
                <article className={s.comment}>
                    <Avatar src={post.avatarOwner} alt={'avatar'} size={"small"}/>
                    <div className={s.commentAuthorName}></div>
                    <div className={s.commentDescription}></div>
                    <div className={s.commentCreationTime}></div>
                    <div className={s.likesCount}></div>
                    <div className={s.commentAnswer}></div>
                    <div className={s.commentLike}></div>
                </article>
            </div>

            <div className={s.postMetaInf}>
             <div className={s.controls}>
                 <button className={s.postIconButton}></button>
                 <button className={s.postIconButton}></button>
                 <button className={s.postIconButton}></button>
             </div>
             <div className={s.avatarsWhoLikes}></div>
             <div className={s.likesCount}></div>
             <div className={s.commentCreationTime}></div>
            </div>

            <div>
                <input className={s.createCommentInput}/>
                <Button variant={"text"}>Publish</Button>
            </div>

        </div>
    );
};