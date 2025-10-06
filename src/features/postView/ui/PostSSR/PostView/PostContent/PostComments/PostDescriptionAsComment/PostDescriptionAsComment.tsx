'use client'
import s from "./PostDescriptionAsComment.module.scss";
import Avatar from "../../../../../../../../entities/user/ui/Avatar/Avatar";//TODO: Avatar перенести в shared?
import {
    PostText
} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostComments/PostDescriptionAsComment/PostText/PostText";
import {useFetchUserQuery} from "@/features/publicUserApi/publicUserApi";

type Props = {
    authorName: string
    postContent: string
    descriptionCreationTime: string
    ownerId: number
};

export const PostDescriptionAsComment = ({
                                             authorName,
                                             descriptionCreationTime,
                                             postContent,
                                             ownerId
                                         }: Props) => {

    const {data: user} = useFetchUserQuery(ownerId)
    return (
        <article className={s.comment}>
            <Avatar src={user?.avatars[0]?.url} alt={'avatar'} size={"small"}/>
            <PostText authorName={authorName}
                      postContent={postContent}
                      descriptionCreationTime={descriptionCreationTime}/>
        </article>
    );
};