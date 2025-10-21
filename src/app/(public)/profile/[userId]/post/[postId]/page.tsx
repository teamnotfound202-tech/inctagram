import {Metadata} from "next";
import ProfilePage from "@/app/(public)/profile/[userId]/page";
import {PostInModal} from "@/features/postView/ui/PostSSR/PostInModal/PostInModal";
export const metadata: Metadata = {title: 'Post'};

const PostPage = ({params}: {
    params: Promise<{ userId: string, postId: string }>,
}) => {
    return <>
        <PostInModal params={params}/>
        <ProfilePage params={params}/>
    </>
}

export default PostPage