'use client'
import {PostContent} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostContent";
import s from "./PostView.module.scss"
import {PostImage} from "@/features/postView/ui/PostSSR/PostView/PostImage/PostImage";
import {Post} from "@/features/postView/api/types";
import {useFetchPostQuery} from "@/features/postView/api/postApi";

type Props = {
    post: Post
}

export const PostView = ({post}: Props) => {
      const {data: postFromCache} = useFetchPostQuery(post.id/*, {skip: needToHydrate}*/)

    //При первой отрисовке берутся данные с сервера(post), а потом делается запрос с помощью useFetchPostQuery за актуальными данными,
    //для которых важна авторизация (например, isLiked для поста), и кладутся в кэш (postFromCache)
    const postToRender = postFromCache || post

    return (
        <div className={s.postWrapper}>
            <PostImage images={postToRender.images}/>{/*TODO: добавить слайдер*/}
            <PostContent post={postToRender}/>
        </div>
    );
};

