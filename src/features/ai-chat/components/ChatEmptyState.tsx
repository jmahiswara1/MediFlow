import { useI18n } from '@/i18n/useI18n'

export function ChatEmptyState() {
  const { t } = useI18n()

  return (
    <div className="animate-in fade-in zoom-in-95 flex flex-1 flex-col items-center justify-center py-16 text-center duration-300 select-none">
      {/* Brand Icon */}
      <div className="from-primary/20 to-primary/5 shadow-primary/10 ring-primary/20 relative mb-5 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-b p-2.5 shadow-md ring-1">
        <img
          src="/logo.png"
          alt="MediFlow AI"
          className="size-9 object-contain"
          onError={(e) => {
            // Fallback to stylized SVG letter if image not available
            e.currentTarget.style.display = 'none'
          }}
        />
        <div className="bg-primary/20 absolute -inset-1 -z-10 rounded-2xl opacity-40 blur-md" />
      </div>

      {/* Main Greeting Question */}
      <h2 className="text-foreground max-w-sm text-lg font-bold tracking-tight sm:text-xl md:text-2xl">
        {t('aiChat.emptyPrompt')}
      </h2>
    </div>
  )
}
