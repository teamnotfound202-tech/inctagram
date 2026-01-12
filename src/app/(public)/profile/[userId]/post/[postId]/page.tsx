import {Metadata} from "next";
import ProfilePage from "@/app/(public)/profile/[userId]/page";
import PostModal from "@/features/postView/ui/PostModal/PostModal";
import {PostSsr} from "@/features/postView";

export const metadata: Metadata = {title: 'Post'};

const PostPage = async ({params}: {
    params: Promise<{ userId: string, postId: string }>,
}) => {
    const {userId} = await params
    return <>
        <PostModal onCloseRedirectUrl={process.env.NEXT_PUBLIC_BASE_URL + '/profile/' + userId}>
            <PostSsr params={params}/>
        </PostModal>
        <ProfilePage params={params}/>
    </>
}

export default PostPage