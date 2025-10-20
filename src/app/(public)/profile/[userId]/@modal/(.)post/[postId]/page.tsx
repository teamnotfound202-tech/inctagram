import {PostSsr} from "@/features/postView";

export default async function ModalLayer({params}: {
    params: Promise<{ userId: string, postId:string }>
}) {
    return <PostSsr params={params} />
}




