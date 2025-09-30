'use client'

import { useMeQuery } from '@/features/auth/api/authApi'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Page() {
  const {data, isLoading} =  useMeQuery()
  const router = useRouter()
  console.log(data)
  console.log(isLoading)

  useEffect(()=>{
    if (isLoading) return
    if(data?.userId){
      router.push(`/profile/${data.userId}`)
    } else{
      router.replace(`/`)
    }
  },[data,router, isLoading])
  return null
}