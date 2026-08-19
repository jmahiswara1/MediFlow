import { useCallback } from 'react'
import { dictionaries } from '@/i18n'
import { useUiStore } from '@/store'

export function useI18n() {
  const locale = useUiStore((state) => state.locale)
  const setLocale = useUiStore((state) => state.setLocale)

  const t = useCallback(
    (key: string): string => {
      const keys = key.split('.')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let value: any = dictionaries[locale]
      for (const k of keys) {
        value = value?.[k]
      }
      return typeof value === 'string' ? value : key
    },
    [locale],
  )

  return { t, locale, setLocale }
}
