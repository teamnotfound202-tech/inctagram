'use client'
import {useEffect} from "react";
import {usePathname, useRouter} from "next/navigation";

import {ACCESS_TOKEN} from "@/shared/lib";
import {Path} from "@/shared/config";
import {useMeQuery} from "@/features/auth/api/authApi";

export default function Page() {
    const router = useRouter()
    const pathname = usePathname()
    const {data, isLoading} = useMeQuery()

    useEffect(() => {
        if (!isLoading) {
            const hasToken = localStorage.getItem(ACCESS_TOKEN)

            const isAuthenticated = !!data?.userId

            if ((hasToken || isAuthenticated) && pathname === '/') {

                router.replace(Path.Profile)

            } else if(!isAuthenticated){
                router.replace(Path.Public)
            }

        }
    }, [data, isLoading, pathname, router])


    return (

        <div>
            {isLoading && <div>Загрузка...</div>}
        </div>
    )
}


