import s from "./PostImage.module.scss";
import {Carousel} from "@/features/postView/ui/PostSSR/PostView/PostImage/Сarousel/Сarousel";
import {Images} from "@/features/postView/api/types";

type Props = {
    imageUrl?: string;
    images:Images[]
}

export const PostImage = ({images}: Props) => {
    return (
        <div className={s.postImageWrapper}>
            <Carousel imagesArray={images}/>
           {/* <img src={imageUrl} alt={'postImage'} className={s.postImage}/>*/}
        </div>
    );
};