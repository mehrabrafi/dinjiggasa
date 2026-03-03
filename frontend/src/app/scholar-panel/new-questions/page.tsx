"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NewQuestionsRedirect() {
    const router = useRouter()
    useEffect(() => {
        router.replace('/scholar-panel/pending')
    }, [router])
    return null
}
