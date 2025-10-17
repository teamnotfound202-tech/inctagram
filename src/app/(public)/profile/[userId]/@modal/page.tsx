import {PostSsr} from "@/features/postView";

export default async function ModalLayer({params}: {
    params: Promise<{ postId: string }>,
}) {
    const awaitedParams = await params;
    return <PostSsr params={awaitedParams} />
}




