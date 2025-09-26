import {Post} from "@/features/postView/api/types";
import {PostView} from "@/features/postView/ui/PostSSR/PostView/PostView";
import PostModal from "@/features/postView/PostModal/PostModal";

interface Props {
    params: {
        id: string;
    };
}

export const PostSsr = async ({params}: Props) => {
    let post
    try {
        post = await getPost(params.id);
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

async function getPost(postId: string): Promise<Post> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/id/${postId}`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch posts');
    }

    return res.json();
}