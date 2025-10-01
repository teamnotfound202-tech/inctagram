import {PostSsr} from "@/features/postView/ui/PostSSR/PostSSR";

interface ProfilePageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProfilePage({
                                              params,
                                              searchParams,
                                          }: ProfilePageProps) {
    const {id} = await params;

    return (
        <div>
            <h1>Профиль пользователя {id}</h1>
            <p>Основной контент профиля...</p>
            <PostSsr params={params} searchParams={searchParams}/>
        </div>
    );
}
