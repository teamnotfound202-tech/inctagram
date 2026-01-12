'use client'
import style from './TestCase.module.scss'
import { useEffect, useState } from 'react'
import { Header } from '../TestCase/Header/Header'
import { HeroSection } from '@/views/TestCase/HeroSection/HeroSection'
import { SliderSection } from '@/views/TestCase/SliderSection/SliderSection'

export const TestCase = () => {
  return (
    <div className={style.contentWrapoper}>
      <Header />
      <HeroSection />
      <SliderSection />
    </div>
  )
}
