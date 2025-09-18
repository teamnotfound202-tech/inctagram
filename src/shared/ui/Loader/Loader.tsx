import s from './Loader.module.scss'

export const Loader = () => {
  return (
      <div className={s.loaderWrapper}>
        <span className={s.loader}></span>
      </div>
  )
}