import s from "./PostTitle.module.scss";
import {Avatar} from "@/entities/user/ui/Avatar";
import {useMeQuery} from "@/features/auth/api/authApi";
import DropdownPostActionsMenu
    from "@/features/postView/ui/PostSSR/PostView/PostContent/PostTitle/DropdownMenuDemo/DropdownPostActionsMenu";
import { useFetchUserQuery } from "@/features/publicUserApi/publicUserApi";

type Props = {
    ownerId: number
    firstName: string
    lastName: string
    postUserName: string
};
export const PostTitle = ({firstName, lastName, ownerId, postUserName}: Props) => {
    const {data} = useMeQuery()
    const {data:user} = useFetchUserQuery(ownerId)
    return (
        <div className={s.postTitle}>
            <div className={s.ownerInf}>
                <Avatar src={user?.avatars[0]?.url} alt={'avatar'}/>
                <div className={s.ownerName}>{firstName && lastName ? firstName + ' ' + lastName : postUserName}</div>
            </div>
            {data?.userId && <DropdownPostActionsMenu isPostOwner={true}/>}
        </div>
    );
};