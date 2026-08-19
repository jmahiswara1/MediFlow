import { en } from './en'
import { id } from './id'
import type { Translation } from './en'

export type Locale = 'en' | 'id'

export const dictionaries: Record<Locale, Translation> = {
  en,
  id,
}

export { en, id }
