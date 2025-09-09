import {Container} from "@/shared/ui";
import {TotalRegisteredUsers} from "@/shared/ui/TotalRegisteredUsers/TotalRegisteredUsers";
import s from './HomePage.module.scss'

export const HomePage = () => {
    return (
        <Container className={s.container}>
            <TotalRegisteredUsers totalCount={12345}/>
        </Container>
    );
};