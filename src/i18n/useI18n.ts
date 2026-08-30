import { useCallback } from 'react'
import { dictionaries } from '@/i18n'
import { useUiStore } from '@/store'

export function useI18n() {
  const locale = useUiStore((state) => state.locale)
  const setLocale = useUiStore((state) => state.setLocale)

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const keys = key.split('.')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let value: any = dictionaries[locale]
      for (const k of keys) {
        value = value?.[k]
      }
      if (typeof value !== 'string') return key
      if (!params) return value
      let str = value
      for (const [pKey, pVal] of Object.entries(params)) {
        str = str.replaceAll(`{${pKey}}`, String(pVal))
      }
      return str
    },
    [locale],
  )

  return { t, locale, setLocale }
}
