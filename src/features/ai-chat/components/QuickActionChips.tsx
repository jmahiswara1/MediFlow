import { useI18n } from '@/i18n/useI18n'

interface QuickActionChipsProps {
  onSelectPrompt: (prompt: string) => void
}

export function QuickActionChips({ onSelectPrompt }: QuickActionChipsProps) {
  const { t } = useI18n()

  const chips = [
    {
      label: t('aiChat.quickChips.criticalStock'),
      prompt: 'Cek daftar obat dengan stok paling kritis di rumah sakit saya',
    },
    {
      label: t('aiChat.quickChips.findSurplus'),
      prompt: 'Di mana rumah sakit terdekat yang memiliki surplus Cairan Infus NaCl 0.9%?',
    },
    {
      label: t('aiChat.quickChips.predictDengue'),
      prompt: 'Bagaimana prediksi lonjakan kasus DBD 14 hari ke depan?',
    },
    {
      label: t('aiChat.quickChips.transferStatus'),
      prompt: 'Bagaimana status pengajuan transfer TRX-001?',
    },
  ]

  return (
    <div className="flex scrollbar-none items-center justify-center gap-2 overflow-x-auto px-2 py-1">
      {chips.map((chip, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onSelectPrompt(chip.prompt)}
          className="group bg-card/90 text-card-foreground border-border/80 hover:border-primary/40 hover:bg-card flex shrink-0 cursor-pointer items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap shadow-xs backdrop-blur-md transition-all"
        >
          <span className="bg-primary/15 text-primary flex size-4 items-center justify-center rounded-sm text-[10px] font-bold">
            M
          </span>
          <span className="text-foreground/85 group-hover:text-primary transition-colors">
            {chip.label}
          </span>
        </button>
      ))}
    </div>
  )
}
