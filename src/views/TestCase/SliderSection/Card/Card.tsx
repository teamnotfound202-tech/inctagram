import React, { useEffect, useState } from 'react'
import style from './Card.module.scss'
import BidIcon from '../../icon/BidIcon.svg'
import Image from 'next/image'
import Picture from '../../icon/Rectangle 85.jpg'
import { CardTimer } from '@/views/TestCase/SliderSection/Card/CardTimer'

type Props = {
  product: string
}
export const CardItem = ({ product }: Props) => {
  function getRandomNumber(min = 0.1, max = 5) {
    return (Math.random() * (max - min) + min).toFixed(2)
  }
  const targetTime =  Date.now() + 7 * 3600 * 1000
  return (
    <div className={style.cardWrapper}>
      <div className={style.picture}>
        <Image src={Picture} alt={'pictureNft'} />
        <CardTimer targetTime={targetTime} />
      </div>
      <div className={style.descr}>
        <p>{product}</p>
      </div>
      <div className={style.cardFooter}>
        <div className={style.left}>
          <div className={style.footerTitle}>
            <p>Current bid</p>
          </div>
          <div className={style.bid}>
            <BidIcon />
            <p>{getRandomNumber()}</p>
          </div>
        </div>
        <div className={style.right}>
          <button className={style.bitBtn}>PLACE BID</button>
        </div>
      </div>
    </div>
  )
}
