import {PostView} from "@/features/postView/ui/PostSSR/PostView/PostView";
import {getPost} from "@/features/postView/utils/getPost";
import {redirect} from "next/navigation";
import {cleanSearchParams} from "@/features/postView/utils/url-utils";
import PostModal from "@/features/postView/ui/PostModal/PostModal";
import s from './PostSSR.module.scss'

export const PostSsr = async ({params, searchParams}: {
    params: { userId: string },
    searchParams: { [key: string]: string | string[] | undefined };
}) => {
    const {userId} = params;
    const resolvedSearchParams = searchParams;
    const postId = resolvedSearchParams.postId as string | undefined;

    // Проверяем конфликт параметров и делаем редирект если нужно
    if (postId && resolvedSearchParams.action) {
        const newSearchParams = cleanSearchParams(resolvedSearchParams);
        newSearchParams.set('postId', postId); // Гарантируем что postId останется
        redirect(`/profile/${userId}?${newSearchParams.toString()}`);
    }

    if (!postId) {
        return null;
    }

    let post;
    try {
        post = await getPost(postId);
    } catch (err) {
        return (
            <PostModal>
                <div className={s.info}>Ошибка загрузки поста</div>
            </PostModal>
        );
    }

    if (!post) {
        return (
            <PostModal>
                <div className={s.info}>Пост не найден</div>
            </PostModal>
        );
    }

    return (
        <PostModal>
            <PostView post={post}/>
        </PostModal>
    );
};