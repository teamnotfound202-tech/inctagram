'use client'
import style from './HeroSection.module.scss'
import Image from 'next/image'
import ImageStatic from '../icon/image1.jpg'
import Arrow from '../icon/Arrow.svg'
import GroupImage from '../icon/Group 427320373.jpg'
import DotIcon from '../icon/DotIcon.svg'
import {useEffect, useRef} from "react";
import gsap from 'gsap'
import { AnimatedCounter } from '@/views/TestCase/HeroSection/AnimaytedCounter'
import { TextPlugin } from 'gsap/TextPlugin'
export const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const descrRef = useRef<HTMLDivElement>(null)
  const btnsRef = useRef<HTMLDivElement>(null)
  const counter1 = useRef<HTMLSpanElement>(null)
  const counter2 = useRef<HTMLSpanElement>(null)
  const counter3 = useRef<HTMLSpanElement>(null)
  const achievementsRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!heroRef.current) return

    const title = heroRef.current.querySelector(`.${style.title}`)
    const descr = heroRef.current.querySelector(`.${style.descr}`)
    const btns = heroRef.current.querySelector(`.${style.btnBlock}`)
    const items = heroRef.current.querySelectorAll(
      `.${style.achievements} .${style.item}`
    )

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
    })

    // 1️⃣ HERO
    tl.fromTo(title, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1 })
      .fromTo(descr, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
      .fromTo(btns, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
      .fromTo(
        items,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.15 }
      )

    // 2️⃣ COUNTERS (ПОСЛЕ HERO)
    tl.add(() => {
      animateCounter(counter1.current, 430)
      animateCounter(counter2.current, 159)
      animateCounter(counter3.current, 87)
    })
  }, [])

  const animateCounter = (
    el: HTMLSpanElement | null,
    value: number
  ) => {
    if (!el) return

    gsap.fromTo(
      el,
      { textContent: 0 },
      {
        textContent: value,
        duration: 1.8,
        snap: { textContent: 1 },
        ease: 'power2.out',
        onUpdate() {
          el.textContent = Math.floor(Number(el.textContent)).toLocaleString()
        },
      }
    )
  }
  return (
    <div className={style.heroWrapper} ref={heroRef}>
      <div className={style.leftBlock}>
        <div className={style.title} ref={titleRef}>
          <p>Discover And Create NFTs</p>
        </div>
        <div className={style.descr} ref={descrRef}>
          <p>
            Discover, Create and Sell NFTs On Our NFT Marketplace With Over Thousands Of NFTs And
            Get a $20 bonus.
          </p>
        </div>
        <div className={style.btnBlock} ref={btnsRef}>
          <button className={style.exploreBtn}>Explore more</button>
          <button className={style.createNft}>Create NFT</button>
        </div>
        <div className={style.achievements} ref={achievementsRef}>
          <div className={style.item}>
            <AnimatedCounter ref={counter1} suffix="K+" />

            <p className={style.achDescr}>Art Works</p>
          </div>
          <div className={style.item}>
            <AnimatedCounter ref={counter2} suffix="K+" />

            <p className={style.achDescr}>Creators</p>
          </div>
          <div className={style.item}>
            <AnimatedCounter ref={counter3} suffix="K+" />

            <p className={style.achDescr}>Collections</p>
          </div>
        </div>
      </div>
      <div className={style.rightBlock}>
        <div className={style.simpleImage}>
          <Image src={ImageStatic} width={391} height={395} alt={'fine image'} />
        </div>
        <div className={style.positionRel}>
          <div className={style.topRel}>
            <Arrow />
            <div className={style.dotIcon}>
              <DotIcon />
              <DotIcon />
            </div>
          </div>
          <div className={style.bottomRel}>
            <Image src={GroupImage} alt={'groupimage'} width={320} height={322} />
          </div>
        </div>
      </div>
    </div>
  )
}
