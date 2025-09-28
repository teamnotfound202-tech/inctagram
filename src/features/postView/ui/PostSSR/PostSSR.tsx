import {PostView} from "@/features/postView/ui/PostSSR/PostView/PostView";
import PostModal from "@/features/postView/PostModal/PostModal";
import {getPost} from "@/features/postView/utils/getPost";

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

