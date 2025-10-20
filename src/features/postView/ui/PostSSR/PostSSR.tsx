import {PostView} from "@/features/postView/ui/PostSSR/PostView/PostView";
import {getPost} from "@/features/postView/utils/getPost";
import PostModal from "@/features/postView/ui/PostModal/PostModal";
import s from './PostSSR.module.scss'

export const PostSsr = async ({params}: {
    params: Promise<{
      userId: string,
      postId: string
    }>
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
        <PostView post={post}/>
    );
};