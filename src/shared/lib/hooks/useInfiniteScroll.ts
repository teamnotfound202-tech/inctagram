import { RefObject, useCallback, useEffect, useRef } from 'react'

type Props = {
  hasNextPage: boolean
  isFetching: boolean
  fetchNextPage: () => void
  rootMargin?: string
  threshold?: number
  rootRef?: RefObject<Element | null>
  enabled: boolean
}

export const useInfiniteScroll = ({
  hasNextPage,
  enabled,
  isFetching,
  fetchNextPage,
  rootRef,
  rootMargin = '100px',
  threshold = 0.1,
}: Props) => {
  const observerRef = useRef<HTMLDivElement>(null)

  const loadMoreHandler = useCallback(() => {
    if (hasNextPage && !isFetching) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetching, fetchNextPage])

  useEffect(() => {
    if(!enabled) return
    // IntersectionObserver отслеживает элементы и сообщает, насколько они видны во viewport
    // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    const observer = new IntersectionObserver(
      entries => {
        // entries - наблюдаемый элемент
        if (entries.length > 0 && entries[0].isIntersecting) {
          loadMoreHandler()
        }
      },
      {
        root: rootRef?.current ?? null, // Отслеживание относительно окна браузера (viewport). null = весь экран
        rootMargin: rootMargin, // Начинать загрузку до появления элемента
        threshold
      }
    )

    const currentObserverRef = observerRef.current
    if (currentObserverRef) {
      // начинает наблюдение за элементом
      observer.observe(currentObserverRef)
    }

    // Функция очистки - прекращает наблюдение при размонтировании компонента
    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef)
      }
    }
  }, [loadMoreHandler, rootRef, enabled, rootMargin, threshold])

  return { observerRef }
}
// import { Ref, RefObject, useCallback, useEffect, useRef } from 'react'
// import { loginSchema } from '@/shared/lib/sсhemas/auth'


//
// import { RefObject, useEffect, useRef } from 'react'                 // CHANGED: сузил импорт, убрал лишнее
//
// type Props = {
//   hasNextPage?: boolean                                             // CHANGED: сделал опциональным (есть дефолт ниже)
//   isFetching?: boolean                                              // CHANGED: сделал опциональным (есть дефолт ниже)
//   fetchNextPage: () => void | Promise<unknown>
//   rootMargin?: string
//   threshold?: number
//   rootRef?: RefObject<HTMLElement | null>                           // CHANGED: Element → HTMLElement для корректного типа
//   enabled?: boolean                                                 // ADDED: включатель инициализации (например, только когда модалка открыта)
// }
//
// export const useInfiniteScroll = ({
//                                     hasNextPage = false,                                              // ADDED: дефолт
//                                     isFetching = false,                                               // ADDED: дефолт
//                                     fetchNextPage,
//                                     rootRef,
//                                     enabled = true,                                                   // ADDED: дефолт
//                                     rootMargin = '0px 0px 120px 0px',                                 // CHANGED: префетч снизу, а не со всех сторон
//                                     threshold = 0.01,
//                                   }: Props) => {
//   const observerRef = useRef<HTMLDivElement | null>(null)           // CHANGED: допускаем null при инициализации
//
//   // ADDED: защищаемся от «устаревших» замыканий
//   const hasNextRef = useRef(hasNextPage)
//   const isFetchingRef = useRef(isFetching)
//   const fetchRef = useRef(fetchNextPage)
//
//   useEffect(() => { hasNextRef.current = hasNextPage }, [hasNextPage])      // ADDED
//   useEffect(() => { isFetchingRef.current = isFetching }, [isFetching])     // ADDED
//   useEffect(() => { fetchRef.current = fetchNextPage }, [fetchNextPage])    // ADDED
//
//   useEffect(() => {
//     if (!enabled) return                                                   // ADDED: не инициализируемся, пока модалка закрыта и DOM не смонтирован
//
//     let io: IntersectionObserver | null = null                             // ADDED: ссылка на IO для корректного disconnect
//     let raf = 0                                                            // ADDED: ждём появления DOM через rAF
//
//     const init = () => {
//       const root = rootRef?.current ?? null
//       const target = observerRef.current
//
//       if (!target || (rootRef && !root)) {                                 // ADDED: ждём, пока появятся корень и цель
//         raf = requestAnimationFrame(init)
//         return
//       }
//
//       io = new IntersectionObserver(
//         ([entry]) => {
//           if (entry.isIntersecting && hasNextRef.current && !isFetchingRef.current) {  // CHANGED: читаем актуальные значения из ref’ов
//             fetchRef.current()
//           }
//         },
//         {
//           root,                                                             // CHANGED: используем переданный root (или null)
//           rootMargin,                                                       // CHANGED: используем проп
//           threshold,                                                        // CHANGED: используем проп
//         }
//       )
//
//       io.observe(target)
//     }
//
//     init()
//
//     return () => {
//       if (io) io.disconnect()                                              // CHANGED: корректная очистка, а не unobserve на одной ноде
//       if (raf) cancelAnimationFrame(raf)                                   // ADDED
//     }
//   }, [enabled, rootRef, rootMargin, threshold])                            // CHANGED: корректные зависимости
//
//   return { observerRef }
// }
