'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useGoogleLoginMutation } from '@/features/auth/api/authApi';
import { ACCESS_TOKEN } from '@/shared/lib';

// Отключить статическую генерацию для страниц с RTK Query
export const dynamic = 'force-dynamic';

function CallbackContent() {
  const router = useRouter();
  const [googleLogin] = useGoogleLoginMutation();
  const params = useSearchParams();
  const code = params.get('code');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) {
      setError('Код авторизации не найден в URL');
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    const handleGoogleCallback = async (): Promise<void> => {
      try {
        const response = await googleLogin({
          code,
          redirectUrl: process.env.NEXT_PUBLIC_REDIRECT_URL!
        }).unwrap();

        if (response.accessToken) {
          sessionStorage.setItem(ACCESS_TOKEN, response.accessToken);
        }

        setTimeout(() => router.push('/profile'), 1000);
      } catch (err) {
        console.error('Ошибка авторизации:', err);
        setError('Ошибка авторизации. Перенаправление на страницу входа...');
        setTimeout(() => router.push('/login'), 2000);
      }
    };

    handleGoogleCallback();
  }, [code, googleLogin, router]);

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>❌ Ошибка</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Google OAuth Callback</h2>
      <div style={{ marginTop: '20px' }}>
        <h3>✅ Обработка авторизации...</h3>
        <p>Пожалуйста, подождите, происходит перенаправление.</p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackContent />
    </Suspense>
  );
}
