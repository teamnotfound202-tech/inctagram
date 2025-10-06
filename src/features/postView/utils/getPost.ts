import {Post} from "@/features/publicUserApi/types";


export async function getPost(postId: string): Promise<Post> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/id/${postId}`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch posts');
    }

    return res.json();
}