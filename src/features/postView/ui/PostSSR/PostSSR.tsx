/*
import {PostView} from "@/features/postView/ui/PostSSR/PostView/PostView";
import PostModal from "@/features/postView/PostModal/PostModal";
import {getPost} from "@/features/postView/utils/getPost";

interface Props {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}


export const PostSsr = async ({params, searchParams}: Props ) => {
    const {id} = await params
    let post
    try {
        post = await getPost(id);
        console.log(post)
    } catch (err) {
        return <div> Такого поста не существует</div>;
    }

    if (!post) return <div>Loading...</div>;

    return (
        <PostModal>
            <PostView post={post}/>
        </PostModal>
    );
};
*/
'use server'
// features/postView/ui/PostSSR/PostView/PostSsr.tsx
import { PostView } from "@/features/postView/ui/PostSSR/PostView/PostView";
import { getPost } from "@/features/postView/utils/getPost";
import { redirect } from "next/navigation";
import { cleanSearchParams } from "@/features/postView/utils/url-utils";
import {PostModal} from "@/features/postView/PostModal/PostModal";

interface PostSsrProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const PostSsr = async ({ params, searchParams }: PostSsrProps) => {
    const { id } = await params;
    const resolvedSearchParams = await searchParams;
    const postId = resolvedSearchParams.postId as string | undefined;

    console.log('PostSsr rendered with:', { id, postId, searchParams: resolvedSearchParams });//TODO: убрать все логи

    // Проверяем конфликт параметров и делаем редирект если нужно
    if (postId && resolvedSearchParams.action) {
        console.log('Conflict detected, redirecting...');
        const newSearchParams = cleanSearchParams(resolvedSearchParams);
        newSearchParams.set('postId', postId); // Гарантируем что postId останется

        redirect(`/profile/${id}?${newSearchParams.toString()}`);
    }

    // Если нет postId - не рендерим модалку
    if (!postId) {
        console.log('No postId, skipping modal');
        return null;
    }

    console.log('Fetching post with id:', postId);

    let post;
    try {
        post = await getPost(postId);

        console.log('Post fetched successfully:', post?.id);
    } catch (err) {
        console.error('Error fetching post:', err);
        return (
            <PostModal>
                <div className="p-8 text-center">Ошибка загрузки поста</div>
            </PostModal>
        );
    }

    if (!post) {
        return (
            <PostModal>
                <div className="p-8 text-center">Пост не найден</div>
            </PostModal>
        );
    }

    return (
        <PostModal>
            <PostView post={post} />
        </PostModal>
    );
};