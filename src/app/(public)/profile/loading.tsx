import s from '@/shared/ui/Loader/Loader.module.scss'

export default function Loading() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
      }}
    >

        <div>Закройте глаза и представте свою страницу .... </div>

    </div>
  )
}
