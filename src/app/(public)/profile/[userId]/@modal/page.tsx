import {PostSsr} from "@/features/postView";

export default async function ModalLayer({params}: {
    params: Promise<{ postId: string, userId: string }>,
}) {
    return <PostSsr params={params} />
}




