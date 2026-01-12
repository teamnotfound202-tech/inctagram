import {ProfilePosts} from '@/views/ProfilePosts/ProfilePosts'
import {responseCodes} from '@/shared/config'
import {PAGINATION} from '@/shared/constants/pagination'
import {ProfileHeader} from '@/features/profile/ProfileHeader'


export default async function ProfilePage(props: {
    params: Promise<{ userId: string }>,
}) {
    const params = await props.params;
    const [postsData, user] = await Promise.all([
        fetch(
            process.env.NEXT_PUBLIC_BACKEND_URL +
            `/posts/user/${params.userId}/?pageSize=${PAGINATION.DEFAULT_PAGE_SIZE}`
        ).then(res => res.json()),
        fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/public-user/profile/${params.userId}`).then(res =>
            res.json()
        ),
    ])

    const userStats = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/users/${user.userName}`)
    const userStatsInfo = await userStats.json()

    if (postsData.statusCode === responseCodes.NotFound) {
        return <div>User not found</div>
    }

    return (
        <div style={{width: '100%'}}>
            <ProfileHeader user={user} userStats={userStatsInfo}/>
            <ProfilePosts postsData={postsData} userId={params.userId.toString()}/>
        </div>
    )
}