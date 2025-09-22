import { ProfilePosts } from '@/views/ProfilePosts/ProfilePosts'
import { responseCodes } from '@/shared/config'
import { PAGINATION } from '@/shared/constants/pagination'



export default async function ProfilePage (props: {
  params: Promise<{ userId: string }>
})  {
  const params = await props.params;
  const resp = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/posts/user/${params.userId}/,?pageSize=${PAGINATION.DEFAULT_PAGE_SIZE}`)
  const postsUser = await resp.json()

  if (postsUser.statusCode === responseCodes.NotFound) {
    return <div>User not found</div>
  }

  return (
    <div style={{width: '100%'}}>
      <ProfilePosts posts={postsUser?.items}/>
    </div>
  )
}