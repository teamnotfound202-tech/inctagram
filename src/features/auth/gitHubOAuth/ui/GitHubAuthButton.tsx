import s from '@/features/auth/gitHubOAuth/ui/GitHubAuthButton.module.scss'
import GitHubIconRegistration from '@/features/auth/styles/icons/gitHubIconRegistration.svg'
import { Button } from '@/shared/ui'

export default function GitHubAuthButton() {
  const loginHandler = () => {
    // Перенаправляем на эндпоинт бэкенда
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/github/login?redirect_url=${process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URL}`
  }

  return (
    <Button onClick={loginHandler} variant={'text'} className={s.gitHubAuthButton}>
      <GitHubIconRegistration />
    </Button>
  )
}
