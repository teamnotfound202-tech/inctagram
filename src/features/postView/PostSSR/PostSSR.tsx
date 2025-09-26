import {Post} from "@/features/postView/api/types";
import {PostView} from "@/features/postView/ui/PostView";

interface Props {
    params: {
        id: string;
    };
}

export const PostSsr = async({params}:Props) => {
    const post = await getPost(params.id);
    if (!post) return <div>Loading...</div>;
    return (
       <PostView post={post}/>
    );
};

async function getPost(postId: string): Promise<Post> {
    // Этот fetch выполняется на сервере
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/id/${postId}`, {
        // Для SSR важно указать cache: 'no-store' или next: { revalidate }
        cache: 'no-store', // Получаем свежие данные при каждом запросе
        // или для ISR: next: { revalidate: 60 } // Обновлять каждые 60 секунд
    });

    if (!res.ok) {
        throw new Error('Failed to fetch posts');
    }

    return res.json();
}