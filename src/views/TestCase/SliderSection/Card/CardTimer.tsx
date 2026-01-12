'use client'
import React, { useEffect, useState } from 'react'
import style from '@/views/TestCase/SliderSection/Card/Card.module.scss'
interface CountdownProps {
  targetTime: number
}
export const CardTimer = ({targetTime}:CountdownProps) => {

  const [timeLeft, setTimeLeft] = useState(targetTime - Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = targetTime - Date.now()
      setTimeLeft(remaining > 0 ? remaining : 0)
    }, 1000)

    return () => clearInterval(interval)
  }, [targetTime])

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`
  }
  return (
    <div className={style.timer}>
      <p>
        {formatTime(timeLeft)}
      </p>
    </div>
  )
}

