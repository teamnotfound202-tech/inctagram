import { ProfilePosts } from '@/views/ProfilePosts/ProfilePosts'
import { responseCodes } from '@/shared/config'
import { PAGINATION } from '@/shared/constants/pagination'



export default async function ProfilePage (props: {
  params: Promise<{ userId: string }>
})  {
  const params = await props.params;
  const resp = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/posts/user/${params.userId}/,?pageSize=${PAGINATION.DEFAULT_PAGE_SIZE}`)
  const postsData = await resp.json()

  if (postsData.statusCode === responseCodes.NotFound) {
    return <div>User not found</div>
  }

  return (
    <div style={{width: '100%'}}>
      <div style={{height: '200px'}}></div>
      <ProfilePosts postsData={postsData} userId={params.userId.toString()}/>
    </div>
  )
}