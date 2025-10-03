import s from "./PostTitle.module.scss";
import {Avatar} from "@/entities/user/ui/Avatar";
import {useMeQuery} from "@/features/auth/api/authApi";
import DropdownPostActionsMenu
    from "@/features/postView/ui/PostSSR/PostView/PostContent/PostTitle/DropdownMenuDemo/DropdownPostActionsMenu";
import { useFetchUserQuery } from "@/features/publicUserApi/publicUserApi";

type Props = {
    ownerId: number;
    avatarOwner: string
    firstName: string
    lastName: string
};
export const PostTitle = ({avatarOwner, firstName, lastName, ownerId}: Props) => {
    const {data} = useMeQuery()
    const {data:user} = useFetchUserQuery(ownerId)
    return (
        <div className={s.postTitle}>
            <div className={s.ownerInf}>
                <Avatar src={user?.avatars[0]?.url|| '/'} alt={'avatar'}/> {/*TODO: надо пофиксить путь*/}
                <div className={s.ownerName}>{firstName + ' ' + lastName}</div>
            </div>
            {data?.userId && <DropdownPostActionsMenu isPostOwner={true}/>}
        </div>
    );
};