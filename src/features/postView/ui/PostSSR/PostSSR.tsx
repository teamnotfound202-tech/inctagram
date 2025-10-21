import {PostView} from "@/features/postView/ui/PostSSR/PostView/PostView";
import {getPost} from "@/features/postView/utils/getPost";
import s from './PostSSR.module.scss'

export const PostSsr = async ({params}: {
    params: Promise<{ postId: string }>,
}) => {
    const {postId} = await params;

    if (!postId) {
        return null;
    }

    let post;
    try {
        post = await getPost(postId);
    } catch (err) {
        return (
            <div className={s.info}>Ошибка загрузки поста</div>
        );
    }

    if (!post) {
        return (
            <div className={s.info}>Пост не найден</div>
        );
    }

    return (
        <PostView post={post}/>
    );
};