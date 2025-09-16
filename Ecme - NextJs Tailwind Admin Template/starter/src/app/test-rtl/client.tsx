'use client'

import { useEffect } from 'react'
import { setLocale } from '@/server/actions/locale'
import useTheme from '@/utils/hooks/useTheme'
import { THEME_ENUM } from '@/constants/theme.constant'

export default function RTLTestClient() {
    const setDirection = useTheme((state) => state.setDirection)

    useEffect(() => {
        // Check URL parameters for locale changes
        const urlParams = new URLSearchParams(window.location.search)
        const locale = urlParams.get('locale')
        
        if (locale) {
            setLocale(locale).then(() => {
                // Set direction based on locale
                const direction = locale === 'ar' ? THEME_ENUM.DIR_RTL : THEME_ENUM.DIR_LTR
                setDirection(direction)
                // Remove the locale parameter and refresh
                const newUrl = new URL(window.location)
                newUrl.searchParams.delete('locale')
                window.history.replaceState({}, '', newUrl.toString())
                window.location.reload()
            })
        }
    }, [setDirection])

    return null // This component only handles side effects
}