import {PostSsr} from "@/features/postView";

export default async function ModalLayer({params, searchParams}: {
    params: Promise<{ userId: string, postId:string }>,
    searchParams: Promise<{ postId?: string }>
}) {
    const awaitedSearchParams = await searchParams;
    const awaitedParams = await params;
    //if (!awaitedSearchParams?.postId) return null
    return <PostSsr params={awaitedParams} searchParams={awaitedSearchParams}/>
}




