import { ProfilePosts } from '@/views/ProfilePosts/ProfilePosts'
import { responseCodes } from '@/shared/config'
import { PAGINATION } from '@/shared/constants/pagination'
import { ProfileHeader } from '@/features/profile/ProfileHeader'



export default async function ProfilePage (props: {
  params: Promise<{ userId: string }>
})  {
  const params = await props.params;
  const resp = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/posts/user/${params.userId}/,?pageSize=${PAGINATION.DEFAULT_PAGE_SIZE}`)
  const postsUser = await resp.json()

  const userData = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/public-user/profile/${params.userId}`)
  const user = await userData.json()

  const userStats = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/users/${user.userName}`)
  const userStatsInfo = await userStats.json()
  console.log(userStatsInfo)

  if (postsUser.statusCode === responseCodes.NotFound) {
    return <div>User not found</div>
  }

  return (
    <div style={{width: '100%'}}>
      <ProfileHeader user={user} userStats={userStatsInfo}/>
      <ProfilePosts posts={postsUser?.items}/>
    </div>
  )
}