import s from "./PostMetaInfWithControls.module.scss";
import {timeToTimeZone} from "@/shared/lib/utils/timeToTimeZone";
import {
    ButtonControls
} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostMetaInfWithControls/ButtonControls/ButtonControls";
import {useFetchMyProfileQuery} from "@/features/publicUserApi/publicUserApi";
import { WhoLikesWrapper } from '@/shared/ui/WhoLikesWrapper/WhoLikesWrapper'

type Props = {
    id: number,
    avatars: string[],
    likesCount: number,
    updatedAt: string,
    isLiked: boolean
};

export const PostMetaInfWithControls = ({avatars, likesCount, updatedAt, isLiked, id}: Props) => {
    const postUpdateTime = timeToTimeZone(updatedAt)
    const {data: meUser} = useFetchMyProfileQuery()

    return (
        <div className={s.postMetaInf}>
            {meUser?.id && <ButtonControls postId={id} isLiked={isLiked}/>}
            <WhoLikesWrapper avatars={avatars} likesCount={likesCount}/>
            <div className={s.postCreationTime}>{postUpdateTime}</div>
        </div>
    );
};