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

const AVATARS_COUNT_TO_PREVIEW_LIKE_STANDART = 3

export const PostMetaInfWithControls = ({avatars, likesCount, updatedAt, isLiked, id}: Props) => {
    const currentLanguage = useAppSelector(selectCurrentMessages)
    const postUpdateTime = timeToTimeZone(updatedAt)
    const {data: meUser} = useFetchMyProfileQuery()

    //Выбираем аватарки последних лайкнувших пост
    const avatarsCountToPreview = (likesCount<AVATARS_COUNT_TO_PREVIEW_LIKE_STANDART)?
        likesCount : //если количество лайков меньше стандарта, то покажи количество аватарок, равное количеству лайков
        AVATARS_COUNT_TO_PREVIEW_LIKE_STANDART                              //

    const avatarsWhoLikesPost = []
    for (let i = avatars.length - avatarsCountToPreview; i < avatars.length; i++) {
        avatarsWhoLikesPost.push(avatars[i])
    }

    return (
        <div className={s.postMetaInf}>
            {meUser?.id && <ButtonControls postId={id} isLiked={isLiked}/>}
            <div className={s.avatarsWhoLikesWrapper}>
                {avatarsWhoLikesPost.map((avatar, index) => (
                    <div key={avatar+index.toString()} className={s.avatars}>
                        <Avatar src={avatar} alt={'avatarsWhoLikes'} size={'very_small'}/>
                    </div>
                ))}
                <div className={s.likesCount}>{likesCount} &#34;{currentLanguage.posts.like}&#34;</div>
            </div>
            <div className={s.postCreationTime}>{postUpdateTime}</div>
        </div>
    );
};