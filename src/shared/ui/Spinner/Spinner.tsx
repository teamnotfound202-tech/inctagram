'use client'

import React from 'react'
import s from './Spinner.module.scss'

type SpinnerProps = {
  size?: number | string
  thickness?: number
  speed?: string
  label?: string
  fullWidth?: boolean
  center?: boolean
  className?: string
  style?: React.CSSProperties
  ariaLabel?: string
  type?: 'primary' | 'secondary'
}

export const Spinner: React.FC<SpinnerProps> = ({
                                                  size = 20,
                                                  thickness = 3,
                                                  speed = '0.8s',
                                                  label,
                                                  fullWidth = false,
                                                  center = false,
                                                  className,
                                                  style,
                                                  ariaLabel = 'Loading…',
                                                  type = 'primary',
                                                }) => {
  const sizeCss = `${size}px`
  const classes = [
    s.root,
    fullWidth ? s.fullWidth : '',
    center ? s.center : '',
    s[type], // ← добавляем класс с цветовой схемой
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  const cssVars: React.CSSProperties = {
    '--size': sizeCss,
    '--thickness': `${thickness}px`,
    '--speed': speed,
  } as React.CSSProperties

  return (
    <div className={classes} style={{ ...cssVars, ...style }} role="status" aria-live="polite">
      <div className={s.spinner} aria-hidden="true" />
      {label ? (
        <span className={s.label}>{label}</span>
      ) : (
        <span className={s.srOnly}>{ariaLabel}</span>
      )}
    </div>
  )
}

export default Spinner