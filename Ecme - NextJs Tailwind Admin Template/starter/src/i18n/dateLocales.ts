export const dateLocales: {
    [key: string]: () => Promise<ILocale>
} = {
    en: () => import('dayjs/locale/en'),
    ar: () => import('dayjs/locale/ar'),
}
