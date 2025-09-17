'use client'
import { useMeQuery } from '@/features/auth/api/authApi'
import {Container} from '@/shared/ui'
import {TotalRegisteredUsers} from '@/shared/ui/TotalRegisteredUsers/TotalRegisteredUsers'
import s from './HomePage.module.scss'
import {useGetTotalRegisteredUsersQuery} from '@/features/publicUserApi/publicUserApi'
import {Sidebar} from '@/widgets/Sidebar/Sidebar'

export const HomePage = () => {
  const {data} = useMeQuery()
  const { data: totalCountUser } = useGetTotalRegisteredUsersQuery()

  return (
    <Container className={s.container}>
      <div className={s.homePageWrapper}>
        {data?.userId && <Sidebar/>}
        <div className={s.homePageContent}>
          {totalCountUser && <TotalRegisteredUsers totalCount={totalCountUser.totalCount} />}
        </div>
      </div>
    </Container>
  )
}
