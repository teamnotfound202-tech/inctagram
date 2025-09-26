'use client'
import {PostContent} from "@/features/postView/ui/PostContent/PostContent";
import s from "./PostView.module.scss"
import {PostImage} from "@/features/postView/ui/PostImage/PostImage";
import {Post} from "@/features/postView/api/types";

type Props = {
    post: Post
}

export const PostView = ({post}: Props) => {
    return (
        <div className={s.postWrapper}>
            <PostImage imageUrl={post.images[0].url}/>
            <PostContent post={post}/>
        </div>
    );
};

