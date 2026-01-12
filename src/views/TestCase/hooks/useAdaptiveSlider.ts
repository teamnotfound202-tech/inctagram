import { useRef, useState, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'

gsap.registerPlugin(Draggable)

export const useAdaptiveSlider = <T,>({
                                        items,
                                        isLoading = false,
                                        onSlideChange,
                                      }: {
  items: T[]
  isLoading?: boolean
  onSlideChange?: (index: number) => void
}) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const draggableRef = useRef<Draggable | null>(null)
  const [slideWidth, setSlideWidth] = useState(0)
  const [gap, setGap] = useState(40)

  const indexRef = useRef(0)
  const len = items.length
  const renderItems = [...items, ...items, ...items]
  const START_INDEX = len // центр

  const slideStep = slideWidth + gap

  // --- измерение ---
  const measure = useCallback(() => {
    if (!trackRef.current) return
    const slide = trackRef.current.querySelector('.slide') as HTMLElement
    if (!slide) return

    const style = getComputedStyle(trackRef.current)
    setGap(parseFloat(style.gap || '0'))
    setSlideWidth(slide.offsetWidth)
  }, [])

  // --- телепорт в безопасную зону ---
  const normalizeIndex = (index: number) => {
    if (index < len) return index + len
    if (index >= len * 2) return index - len
    return index
  }

  // --- движение ---
  const goTo = (step: number, animate = true) => {
    if (!trackRef.current || !slideStep) return

    // 1. корректируем индекс перед анимацией
    indexRef.current = normalizeIndex(indexRef.current)

    // 2. новый индекс после шага
    const nextIndex = indexRef.current + step

    gsap.killTweensOf(trackRef.current)
    const x = -nextIndex * slideStep

    gsap.to(trackRef.current, {
      x,
      duration: animate ? 0.4 : 0,
      ease: 'power2.out',
      onComplete: () => {
        // 3. нормализуем после движения
        indexRef.current = normalizeIndex(nextIndex)
        gsap.set(trackRef.current, { x: -indexRef.current * slideStep })

        onSlideChange?.(indexRef.current % len)
      },
    })
  }

  // --- кнопки ---
  const nextSlide = () => goTo(1)
  const prevSlide = () => goTo(-1)

  // --- drag ---
  const initDraggable = useCallback(() => {
    if (!trackRef.current || !slideStep) return
    draggableRef.current?.kill()

    draggableRef.current = Draggable.create(trackRef.current, {
      type: 'x',
      inertia: true,
      onDragEnd() {
        const index = Math.round(Math.abs(this.x) / slideStep)
        const step = index - indexRef.current
        goTo(step)
      },
    })[0]
  }, [slideStep])

  // --- init ---
  useEffect(() => {
    if (isLoading || len === 0) return

    measure()
    indexRef.current = START_INDEX
    gsap.set(trackRef.current, { x: -START_INDEX * slideStep })
    initDraggable()
  }, [len, isLoading, measure, initDraggable, slideStep])

  return {
    trackRef,
    renderItems,
    nextSlide,
    prevSlide,
    currentIndex: ((indexRef.current % len) + len) % len,
  }
}