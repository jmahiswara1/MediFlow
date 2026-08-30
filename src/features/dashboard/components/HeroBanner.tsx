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
    <div className="bg-primary text-primary-foreground relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-6 shadow-sm md:p-7">
      {/* Soft overlay circles for depth */}
      <div className="bg-primary-foreground/10 pointer-events-none absolute -top-16 -right-16 size-64 rounded-full" />
      <div className="bg-primary-foreground/8 pointer-events-none absolute -right-8 -bottom-20 size-48 rounded-full" />

      <div className="relative grid h-full items-center gap-6 md:grid-cols-5">
        <div className="flex h-full flex-col justify-between space-y-4 md:col-span-3">
          <div className="text-primary-foreground/80 inline-flex items-center gap-2 text-xs font-medium">
            <Calendar className="size-3.5" />
            <span>{today}</span>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl leading-tight font-bold tracking-tight md:text-3xl">
              {t('dashboard.greeting').replace('{name}', firstName)}
            </h2>
            <p className="text-primary-foreground/85 max-w-md text-sm leading-relaxed">
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

        <div className="flex h-full items-center justify-center md:col-span-2 md:justify-end">
          <HeroIllustration className="text-primary-foreground h-32 w-auto md:h-36" />
        </div>
      </div>
    </div>
  )
}
