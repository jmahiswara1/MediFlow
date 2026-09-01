import { Calendar, MapPin } from 'lucide-react'
import { useI18n } from '@/i18n/useI18n'
import { useCurrentUser } from '@/store'
import { HeroIllustration } from './illustrations/HeroIllustration'

export function HeroBanner() {
  const { t, locale } = useI18n()
  const currentUser = useCurrentUser()

  const today = new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())

  const firstName = currentUser?.name.split(' ')[0] ?? 'User'
  const hospitalName = currentUser?.hospitalName ?? ''

  return (
    <div className="bg-primary text-primary-foreground relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-4 shadow-sm sm:p-6 md:p-7">
      {/* Soft overlay circles for depth */}
      <div className="bg-primary-foreground/10 pointer-events-none absolute -top-16 -right-16 size-48 rounded-full sm:size-64" />
      <div className="bg-primary-foreground/8 pointer-events-none absolute -right-8 -bottom-20 size-36 rounded-full sm:size-48" />

      <div className="relative flex h-full flex-col-reverse items-center justify-between gap-4 sm:gap-6 md:grid md:grid-cols-5">
        <div className="flex h-full w-full flex-col justify-between space-y-3 sm:space-y-4 md:col-span-3">
          <div className="text-primary-foreground/80 inline-flex items-center gap-2 text-xs font-medium">
            <Calendar className="size-3.5" />
            <span>{today}</span>
          </div>

          <div className="space-y-1 sm:space-y-1.5">
            <h2 className="text-xl leading-tight font-bold tracking-tight sm:text-2xl md:text-3xl">
              {t('dashboard.greeting').replace('{name}', firstName)}
            </h2>
            <p className="text-primary-foreground/85 max-w-md text-xs leading-relaxed sm:text-sm">
              {t('dashboard.greetingSub')}
            </p>
          </div>

          {hospitalName && (
            <div className="text-primary-foreground bg-primary-foreground/15 inline-flex w-fit items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
              <MapPin className="size-3.5" />
              <span>{hospitalName}</span>
            </div>
          )}
        </div>

        <div className="flex w-full items-center justify-center md:col-span-2 md:justify-end">
          <HeroIllustration className="text-primary-foreground h-24 w-auto sm:h-28 md:h-36" />
        </div>
      </div>
    </div>
  )
}
