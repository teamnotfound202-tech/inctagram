'use client'
import {Container} from "@/shared/ui";
import {TotalRegisteredUsers} from "@/shared/ui/TotalRegisteredUsers/TotalRegisteredUsers";
import s from './HomePage.module.scss'
import {useGetTotalRegisteredUsersQuery} from "@/features/publicUserApi/publicUserApi";
import {Sidebar} from "@/widgets/Sidebar/Sidebar";

export const HomePage = () => {

    const {data} = useGetTotalRegisteredUsersQuery()

    return (
        <Container className={s.container}>
            <div className={s.homePageWrapper}>
                <Sidebar/>
                <div className={s.homePageContent}>
                    {data && <TotalRegisteredUsers totalCount={data.totalCount} />}
                </div>
            </div>
        </Container>
    );
};