'use client'
import {PostContent} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostContent";
import s from "./PostView.module.scss"
import {PostImage} from "@/features/postView/ui/PostSSR/PostView/PostImage/PostImage";
import {Post} from "@/features/postView/api/types";
import {Carousel} from "@/features/postView/ui/PostSSR/PostView/PostImage/Сarousel/Сarousel";
import {useAppDispatch} from "@/shared/lib/hooks/hooks";
import {postApi} from "@/features";
import {useEffect, useRef, useState} from "react";
import {useFetchPostQuery} from "@/features/postView/api/postApi";

type Props = {
    post: Post
}

export const PostView = ({post}: Props) => {
    const [needToHydrate, setNeedToHydrate] = useState(true)

    const dispatch = useAppDispatch()

    const {data: postFromCache} = useFetchPostQuery(post.id, {skip: needToHydrate})

    useEffect(() => {
        if (needToHydrate) {
            dispatch(
                postApi.util.upsertQueryData('fetchPost', post.id, post) //положим данные поста в кэш
            );
            setNeedToHydrate(false)
        }
    }, []);

    const postToRender = postFromCache || post

    return (
        <div className={s.postWrapper}>
            <PostImage images={postToRender.images}/>{/*TODO: добавить слайдер*/}
            <PostContent post={postToRender}/>
        </div>
    );
};

