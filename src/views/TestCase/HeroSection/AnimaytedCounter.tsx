'use client'
import { forwardRef } from 'react'
import style from './HeroSection.module.scss'

interface AnimatedCounterProps {
  suffix?: string
}

export const AnimatedCounter = forwardRef<
  HTMLSpanElement,
  AnimatedCounterProps
>(({ suffix = '' }, ref) => {
  return (
    <p className={style.number}>
      <span ref={ref}>0</span>
      {suffix}
    </p>
  )
})

AnimatedCounter.displayName = 'AnimatedCounter'