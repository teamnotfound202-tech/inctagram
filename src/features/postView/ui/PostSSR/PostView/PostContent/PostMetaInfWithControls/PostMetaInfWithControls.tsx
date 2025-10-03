import s from "./PostMetaInfWithControls.module.scss";
import Avatar from "../../../../../../../entities/user/ui/Avatar/Avatar";
import {timeToTimeZone} from "@/shared/lib/utils/timeToTimeZone";
import {useAppSelector} from "@/shared/lib/hooks/hooks";
import {selectCurrentMessages} from "@/shared/api/appSlice";
import {
    ButtonControls
} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostMetaInfWithControls/ButtonControls/ButtonControls";
import {useFetchMyProfileQuery} from "@/features/publicUserApi/publicUserApi";

type Props = {
    id: number,
    avatars: string[],
    likesCount: number,
    updatedAt: string,
    isLiked: boolean
};

export const PostMetaInfWithControls = ({avatars, likesCount, updatedAt, isLiked, id}: Props) => {
    const currentLanguage = useAppSelector(selectCurrentMessages)
    const postUpdateTime = timeToTimeZone(updatedAt)
    const {data: meUser} = useFetchMyProfileQuery()

    return (
        <div className={s.postMetaInf}>
            {meUser?.id && <ButtonControls postId={id} isLiked={isLiked}/>}
            <div className={s.avatarsWhoLikesWrapper}>
                {avatars.map((avatar) => (
                    <div key={avatar} className={s.avatars}>
                        <Avatar src={avatar} alt={'avatarsWhoLikes'} size={'very_small'}/>
                    </div>
                ))}
                <div className={s.likesCount}>{likesCount} &#34;{currentLanguage.posts.like}&#34;</div>
            </div>
            <div className={s.postCreationTime}>{postUpdateTime}</div>
        </div>
    );
};