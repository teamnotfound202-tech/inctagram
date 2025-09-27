// @flow
import * as React from 'react';
import s from "./PostTitle.module.scss";
import {Avatar} from "@/entities/user/ui/Avatar";
import DotsHorizontalIcon from "@/features/postView/ui/PostSSR/PostView/Icons/DotsHorizontal.svg";
import {useMeQuery} from "@/features/auth/api/authApi";
import DropdownPostActionsMenu
    from "@/features/postView/ui/PostSSR/PostView/PostContent/PostTitle/DropdownMenuDemo/DropdownPostActionsMenu";

type Props = {
    avatarOwner:string
    userName:string
    commentOwnerId:number
};
export const PostTitle = ({avatarOwner, userName,commentOwnerId}: Props) => {
    const {data} = useMeQuery()
    return (
        <div className={s.postTitle}>
            <div className={s.ownerInf}>
                <Avatar src={avatarOwner} alt={'avatar'}/>
                <div className={s.ownerName}>{userName}</div>
            </div>
            <DropdownPostActionsMenu isPostOwner={data?.userId === commentOwnerId}/>
        </div>
    );
};