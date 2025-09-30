import {PostView} from "@/features/postView/ui/PostSSR/PostView/PostView";
import PostModal from "@/features/postView/PostModal/PostModal";
import {getPost} from "@/features/postView/utils/getPost";

export const PostSsr = async ({params}: { params: Promise<{ id: string }> }) => {
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

