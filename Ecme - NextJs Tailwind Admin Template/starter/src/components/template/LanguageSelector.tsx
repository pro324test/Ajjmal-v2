'use client'

import { useMemo, useTransition } from 'react'
import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import classNames from 'classnames'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import { HiCheck } from 'react-icons/hi'
import { setLocale } from '@/server/actions/locale'
import { useLocale } from 'next-intl'
import useTheme from '@/utils/hooks/useTheme'
import { THEME_ENUM } from '@/constants/theme.constant'
import type { CommonProps } from '@/@types/common'

const languageList = [
    { label: 'English', value: 'en', flag: 'US', direction: 'ltr' },
    { label: 'العربية', value: 'ar', flag: 'SA', direction: 'rtl' },
]

const _LanguageSelector = ({ className }: CommonProps) => {
    const locale = useLocale()
    const setDirection = useTheme((state) => state.setDirection)
    const [isPending, startTransition] = useTransition()

    const selectLangFlag = useMemo(() => {
        return languageList.find((lang) => lang.value === locale)?.flag
    }, [locale])

    const handleUpdateLocale = async (newLocale: string) => {
        const selectedLang = languageList.find((lang) => lang.value === newLocale)
        
        startTransition(async () => {
            // Set the locale
            await setLocale(newLocale)
            
            // Automatically set direction based on language
            if (selectedLang) {
                setDirection(selectedLang.direction === 'rtl' ? THEME_ENUM.DIR_RTL : THEME_ENUM.DIR_LTR)
            }
            
            // Refresh the page to apply changes
            window.location.reload()
        })
    }

    const selectedLanguage = (
        <div className={classNames(className, 'flex items-center')}>
            <Avatar
                size={24}
                shape="circle"
                src={`/img/countries/${selectLangFlag}.png`}
            />
        </div>
    )

    return (
        <Dropdown renderTitle={selectedLanguage} placement="bottom-end">
            {languageList.map((lang) => (
                <Dropdown.Item
                    key={lang.label}
                    className="justify-between"
                    eventKey={lang.label}
                    onClick={() => handleUpdateLocale(lang.value)}
                    disabled={isPending}
                >
                    <span className="flex items-center">
                        <Avatar
                            size={18}
                            shape="circle"
                            src={`/img/countries/${lang.flag}.png`}
                        />
                        <span className="ltr:ml-2 rtl:mr-2">{lang.label}</span>
                    </span>
                    {locale === lang.value && (
                        <HiCheck className="text-emerald-500 text-lg" />
                    )}
                </Dropdown.Item>
            ))}
        </Dropdown>
    )
}

const LanguageSelector = withHeaderItem(_LanguageSelector)

export default LanguageSelector
