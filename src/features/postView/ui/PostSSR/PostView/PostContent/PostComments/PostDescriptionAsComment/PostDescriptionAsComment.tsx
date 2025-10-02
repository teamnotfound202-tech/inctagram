'use client'
import s from "./PostDescriptionAsComment.module.scss";
import Avatar from "../../../../../../../../entities/user/ui/Avatar/Avatar";
import {
    PostText
} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostComments/PostDescriptionAsComment/PostText/PostText";

type Props = {
    avatarUrl: string
    authorName: string
    postContent: string
    descriptionCreationTime: string
};

export const PostDescriptionAsComment = ({
                                             avatarUrl,
                                             authorName,
                                             descriptionCreationTime,
                                             postContent
                                         }: Props) => {


    return (
        <article className={s.comment}>
            <Avatar src={avatarUrl} alt={'avatar'} size={"small"}/>
            <PostText authorName={authorName}
                      postContent={postContent}
                      descriptionCreationTime={descriptionCreationTime}/>
        </article>

    );
};