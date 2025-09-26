// @flow
import * as React from 'react';
import s from "./PostTitle.module.scss";
import {Avatar} from "@/entities/user/ui/Avatar";
import {Button} from "@/shared/ui";
import DotsHorizontalIcon from "@/features/postView/ui/PostSSR/PostView/Icons/DotsHorizontal.svg";

type Props = {
    avatarOwner:string
    userName:string
};
export const PostTitle = ({avatarOwner, userName}: Props) => {
    return (
        <div className={s.postTitle}>
            <div className={s.ownerInf}>
                <Avatar src={avatarOwner} alt={'avatar'}/>
                <div className={s.ownerName}>{userName}</div>
            </div>
            <button className={s.contextButton}>
                <DotsHorizontalIcon/>
            </button>
        </div>
    );
};