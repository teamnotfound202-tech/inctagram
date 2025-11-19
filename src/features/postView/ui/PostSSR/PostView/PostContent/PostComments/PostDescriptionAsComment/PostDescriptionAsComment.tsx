'use client'
import s from "./PostDescriptionAsComment.module.scss";
import Avatar from "../../../../../../../../entities/user/ui/Avatar/Avatar";//TODO: Avatar перенести в shared?
import {
    PostText
} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostComments/PostDescriptionAsComment/PostText/PostText";
import {useFetchUserQuery} from "@/features/publicUserApi/publicUserApi";
import Link from 'next/link'

type Props = {
    authorName: string | null
    postContent: string
    descriptionCreationTime?: string
    ownerId: number
    postUserName: string
};

export const PostDescriptionAsComment = ({
    authorName,
    descriptionCreationTime,
    postContent,
    ownerId,
    postUserName
}: Props) => {

    const {data: user} = useFetchUserQuery(ownerId)
    return (
        <article className={s.comment}>
          <Link className={s.commentLink} href={`/profile/${ownerId}`}>
            <Avatar src={user?.avatars[0]?.url} alt={'avatar'} size={"small"}/>
          </Link>
            <PostText authorName={authorName}
                      postUserName={postUserName}
                      postContent={postContent}
                      descriptionCreationTime={descriptionCreationTime}
                      ownerId={ownerId}
            />
        </article>
    );
};