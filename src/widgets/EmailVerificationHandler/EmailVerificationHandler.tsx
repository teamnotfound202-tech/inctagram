'use client';
import { useRegistrationConfirmationMutation } from '@/features/auth/api/authApi';
import { Path } from '@/shared/config';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EmailVerificationHandler() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [verify] = useRegistrationConfirmationMutation();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const code = searchParams.get('code');
    if (code) {
      verify({ confirmationCode: code })
        .unwrap()
        .then(() => {
          router.push(Path.Success);
        })
        .catch((err) => {
          router.push(Path.Resend);
        });
    }
  }, [searchParams, verify, router]);

  return <div>Verifying email...</div>;
}
