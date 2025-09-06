'use client'
import { useRouter } from "next/navigation"
import {type ReactNode, useEffect, useState} from 'react';

export default function AuthGuard({ children }: { children: ReactNode }) {
    const router = useRouter()
    const [isChecking, setIsChecking] = useState(true)

    useEffect(() => {
        const token = sessionStorage.getItem("accessToken")
        if (!token) {
            router.replace("/login")
        } else {
            setIsChecking(false)
        }
    }, [router])

    if (isChecking) return <div>Загрузка...</div>

    return <>{children}</>
}