import s from "./PostImage.module.scss";

type Props = {
    imageUrl: string;
}

export const PostImage = ({imageUrl}: Props) => {
    return (
        <div className={s.postImageWrapper}>
            <img src={imageUrl} alt={'postImage'} className={s.postImage}/>
        </div>
    );
};