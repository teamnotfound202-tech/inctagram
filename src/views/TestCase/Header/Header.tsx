'use client'
import style from './Header.module.scss'
import Link from 'next/link'
import HeaderIcon from '../icon/HeaderIcon.svg'
export const Header = () => {
  return (
    <div className={style.headerWrapoper}>
      <div className={style.headerContent}>
        <div className={style.headerNav}>
          <div><HeaderIcon/></div>
          <nav className={style.nav}>
            <Link href={'/'}>Discover</Link>
            <Link href={'/'}>Creators</Link>
            <Link href={'/'}>Sell</Link>
            <Link href={'/'}>Stats</Link>
          </nav>
        </div>
        <div className={style.headerBtn}>
          <button className={style.btn}>Connect wallet</button>
        </div>
      </div>
    </div>
  )
}
