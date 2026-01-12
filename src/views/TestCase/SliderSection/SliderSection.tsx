'use client'
import React, { useEffect, useState } from 'react'
import style from './SliderSection.module.scss'
import { AdaptiveSlider } from '@/views/TestCase/hooks/AdaptiveSlider'
import { CardItem } from '@/views/TestCase/SliderSection/Card/Card'

export const SliderSection = () => {
  const [sliderData, setSliderData] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    const fetchData = async () => {
      try {
        setLoading(true)

        const response = await fetch('https://api.coingecko.com/api/v3/nfts/list', { signal })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setSliderData(data.map((item: { name: string }) => item.name))
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('Fetch aborted')
        } else {
          console.error('Fetch error:', err)
          setSliderData(['err'])
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false)
        }
      }
    }
    fetchData()
    return () => {
      controller.abort()
    }
  }, [])
  // Компонент загрузки
  const LoadingState = () => (
    <>
      <p>Загружаем продукты...</p>
    </>
  )

  // Компонент пустого состояния
  const EmptyState = () => (
    <div>
      <svg>
        <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
      </svg>
      <h3>Продуктов нет</h3>
    </div>
  )

  return (
    <div className={style.sliderSectionWrapper}>
      <div className={style.title}>
        <p> Weekly - Top NFT</p>
      </div>
      <div className={style.sliderContainer}>
        <AdaptiveSlider
          items={sliderData}
          isLoading={loading}
          loadingComponent={<LoadingState />}
          emptyComponent={<EmptyState />}
          //className={styles.productsSlider}
          showControls={true}
        >
          {(product, index) => <CardItem key={`${product}-${index}`} product={product} />}
        </AdaptiveSlider>
      </div>
    </div>
  )
}
