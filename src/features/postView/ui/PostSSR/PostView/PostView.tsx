'use client'
import {PostContent} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostContent";
import s from "./PostView.module.scss"
import {PostImage} from "@/features/postView/ui/PostSSR/PostView/PostImage/PostImage";
import {Post} from "@/features/postView/api/types";
import {Carousel} from "@/features/postView/ui/PostSSR/PostView/PostImage/Сarousel/Сarousel";

type Props = {
    post: Post
}

export const PostView = ({post}: Props) => {

    return (
        <div className={s.postWrapper}>
            <PostImage images={post.images}/>{/*TODO: добавить слайдер*/}
            <PostContent post={post}/>
        </div>
    );
};

