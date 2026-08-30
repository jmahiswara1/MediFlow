import { useI18n } from '@/i18n/useI18n'
import { ProfileHeaderCard } from './components/ProfileHeaderCard'
import { HospitalInfoCard } from './components/HospitalInfoCard'
import { UserActivityStats } from './components/UserActivityStats'
import { RecentActivityTimeline } from './components/RecentActivityTimeline'
import { AccountSwitcherCard } from './components/AccountSwitcherCard'

export function ProfilePage() {
  const { t } = useI18n()

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-y-auto pr-1 pb-8">
      {/* Header */}
      <div className="mb-5 space-y-1">
        <h1 className="text-foreground text-xl font-bold tracking-tight md:text-2xl">
          {t('profile.title')}
        </h1>
        <p className="text-muted-foreground text-xs md:text-sm">{t('profile.subtitle')}</p>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Left Column: Profile Info, Activity Stats, Hospital Info, Activity Timeline */}
        <div className="space-y-5 lg:col-span-8">
          <ProfileHeaderCard />
          <UserActivityStats />
          <HospitalInfoCard />
          <RecentActivityTimeline />
        </div>

        {/* Right Column: Account Switcher */}
        <div className="space-y-5 lg:col-span-4">
          <AccountSwitcherCard />
        </div>
      </div>
    </div>
  )
}
