import { FC } from 'react'

import s from './Avatar.module.scss'
import placeholder from './ava.png'

type AvatarProps = {
  src?: string
  alt: string
  size?: 'very_small' | 'small' | 'medium' | 'large'
  withStatus?: boolean
}

const Avatar: FC<AvatarProps> = ({ src, alt, size = 'medium', withStatus = false }) => {
  const imgSrc = src ?? placeholder.src
  return (
    <div className={`${s.avatar} ${s[`avatar--${size}`]}`}>
      <div className={s.avatar__container}>
        <img src={imgSrc} alt={alt} className={s.avatar__image} loading={'lazy'} />
      </div>
      {withStatus && <div className={s.avatar__status} />}
    </div>
  )
}

export default Avatar
