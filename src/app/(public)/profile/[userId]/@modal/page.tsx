import {PostSsr} from "@/features/postView";

export default async function ModalLayer({params, searchParams}: {
    params: { userId: string },
    searchParams: { postId?: string }
}) {
    if (!searchParams.postId) return null
    return <PostSsr params={params} searchParams={searchParams}/>

}

