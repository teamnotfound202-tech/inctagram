import PostModal from "@/features/postView/ui/PostModal/PostModal";
import {PostSsr} from "@/features/postView";

export const PostInModal = async ({params}: {
    params: Promise<{ userId: string, postId: string }>,
}) => {
    return (
        <PostModal>
            <PostSsr params={params}/>
        </PostModal>
    );
};