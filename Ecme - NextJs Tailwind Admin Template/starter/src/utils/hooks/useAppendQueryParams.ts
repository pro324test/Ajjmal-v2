'use client'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

const useAppendQueryParams = () => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const onAppendQueryParams = (
        params: Record<string, string | number | boolean>,
    ) => {
        const updatedParams = new URLSearchParams(searchParams.toString())

        Object.entries(params).forEach(([name, value]) => {
            updatedParams.set(name, String(value))
        })

        const newQueryString = updatedParams.toString()
        const newUrl = `${pathname}?${newQueryString}`
        
        // Use router.push with refresh for proper server-side re-rendering
        router.push(newUrl)
        router.refresh()
    }

    return { onAppendQueryParams }
}

export default useAppendQueryParams
