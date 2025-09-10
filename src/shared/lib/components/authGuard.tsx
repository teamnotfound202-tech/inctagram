'use client'
import { useRouter } from "next/navigation"
import {type ReactNode, useEffect, useState} from 'react';
import {Path} from "@/shared/config";
import {ACCESS_TOKEN} from "@/shared/lib";

export default function AuthGuard({ children }: { children: ReactNode }) {
    const router = useRouter()
    const [isChecking, setIsChecking] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (!token) {
            router.replace(Path.SignIn)
        } else {
            setIsChecking(false)
        }
    }, [router])

    if (isChecking) return <div>Загрузка...</div>

    return <>{children}</>
}