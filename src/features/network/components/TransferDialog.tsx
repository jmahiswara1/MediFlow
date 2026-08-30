import { useEffect, useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { Building2, Pill, Send } from 'lucide-react'
import { useI18n } from '@/i18n/useI18n'
import { useCurrentUser, useStockStore, useTransferStore } from '@/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CustomSelect, type SelectOption } from '@/components/ui/custom-select'
import { StatusBadge } from '@/components/ui/status-badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Hospital, Urgency } from '@/types'
import { cn } from '@/lib/utils'

interface TransferDialogProps {
  open: boolean
  onClose: () => void
  toHospital?: Hospital | null
  preSelectedMedicineId?: string | null
}

interface FormValues {
  targetHospitalId: string
  medicineId: string
  quantity: number
  urgency: Urgency
  notes: string
}

const URGENCY_OPTIONS: { value: Urgency; key: 'high' | 'normal' | 'low' }[] = [
  { value: 'high', key: 'high' },
  { value: 'normal', key: 'normal' },
  { value: 'low', key: 'low' },
]

export function TransferDialog({
  open,
  onClose,
  toHospital,
  preSelectedMedicineId,
}: TransferDialogProps) {
  const { t } = useI18n()
  const currentUser = useCurrentUser()
  const hospitals = useStockStore((s) => s.hospitals)
  const medicines = useStockStore((s) => s.medicines)
  const addRequest = useTransferStore((s) => s.addRequest)

  // Available destination hospitals (exclude own hospital)
  const availableHospitals = useMemo(
    () => hospitals.filter((h) => h.id !== currentUser?.hospitalId),
    [hospitals, currentUser],
  )

  const initialTargetHospitalId = toHospital?.id ?? availableHospitals[0]?.id ?? ''

  const defaultValues: FormValues = {
    targetHospitalId: initialTargetHospitalId,
    medicineId: preSelectedMedicineId ?? medicines[0]?.id ?? '',
    quantity: 1,
    urgency: 'normal',
    notes: '',
  }

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ defaultValues })

  // Reset when opening
  useEffect(() => {
    if (open) {
      const targetId = toHospital?.id ?? availableHospitals[0]?.id ?? ''
      reset({
        targetHospitalId: targetId,
        medicineId: preSelectedMedicineId ?? medicines[0]?.id ?? '',
        quantity: 1,
        urgency: 'normal',
        notes: '',
      })
    }
  }, [open, toHospital, preSelectedMedicineId, medicines, availableHospitals, reset])

  const selectedHospitalId =
    useWatch({ control, name: 'targetHospitalId' }) || initialTargetHospitalId
  const selectedMedicineId = useWatch({ control, name: 'medicineId' })
  const selectedQuantity = useWatch({ control, name: 'quantity' })
  const selectedUrgency = useWatch({ control, name: 'urgency' })

  const effectiveToHospital = useMemo(
    () =>
      hospitals.find((h) => h.id === selectedHospitalId) ??
      toHospital ??
      availableHospitals[0] ??
      null,
    [hospitals, selectedHospitalId, toHospital, availableHospitals],
  )

  const toStock = useMemo(
    () => effectiveToHospital?.stocks.find((s) => s.medicineId === selectedMedicineId),
    [effectiveToHospital, selectedMedicineId],
  )

  const maxAllowed = toStock ? Math.floor(toStock.currentStock * 0.5) : 0

  // Hospital options for modern CustomSelect
  const hospitalOptions: SelectOption[] = useMemo(
    () =>
      availableHospitals.map((h) => ({
        value: h.id,
        label: h.name,
        subLabel: `${h.city} • ${h.region}`,
        icon: Building2,
        badge: <StatusBadge status={h.stockStatus} label={t(`status.${h.stockStatus}`)} />,
      })),
    [availableHospitals, t],
  )

  // Medicine options for modern CustomSelect
  const medicineOptions: SelectOption[] = useMemo(
    () =>
      medicines.map((m) => {
        const stock = effectiveToHospital?.stocks.find((s) => s.medicineId === m.id)
        const hasStock = Boolean(stock && stock.currentStock > 0)
        return {
          value: m.id,
          label: m.name,
          subLabel: `${m.category} • Satuan: ${m.unit}`,
          icon: Pill,
          badge: (
            <span
              className={cn(
                'rounded-md px-2 py-0.5 text-[10px] font-bold tabular-nums',
                hasStock ? 'bg-safe/15 text-safe' : 'bg-critical/15 text-critical',
              )}
            >
              {stock ? `${stock.currentStock} ${m.unit}` : 'Kosong'}
            </span>
          ),
          disabled: !hasStock,
        }
      }),
    [medicines, effectiveToHospital],
  )

  const onSubmit = (data: FormValues) => {
    if (!currentUser || !effectiveToHospital || !toStock) return
    const medicine = medicines.find((m) => m.id === data.medicineId)
    if (!medicine) return

    addRequest({
      fromHospitalId: currentUser.hospitalId,
      fromHospitalName: currentUser.hospitalName,
      toHospitalId: effectiveToHospital.id,
      toHospitalName: effectiveToHospital.name,
      medicineId: data.medicineId,
      medicineName: medicine.name,
      quantity: data.quantity,
      urgency: data.urgency,
      notes: data.notes,
      createdBy: currentUser.id,
      createdByName: currentUser.name,
    })

    toast.success(t('transfer.requestSent'), {
      description: `${medicine.name} • ${data.quantity} item • ${effectiveToHospital.name}`,
    })
    onClose()
  }

  if (!currentUser) return null

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{t('transfer.newRequest')}</DialogTitle>
          <DialogDescription className="text-xs">
            {currentUser.hospitalName} {effectiveToHospital ? `→ ${effectiveToHospital.name}` : ''}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          {/* Modern Destination Hospital Selector */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">{t('transfer.toHospital')}</Label>
            <CustomSelect
              options={hospitalOptions}
              value={selectedHospitalId}
              onChange={(val) => setValue('targetHospitalId', val)}
              disabled={Boolean(toHospital)}
              icon={Building2}
            />
          </div>

          {/* Modern Medicine Selector */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">{t('transfer.medicine')}</Label>
            <CustomSelect
              options={medicineOptions}
              value={selectedMedicineId}
              onChange={(val) => setValue('medicineId', val)}
              icon={Pill}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="quantity" className="text-xs font-semibold">
                {t('transfer.quantity')}
              </Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                max={maxAllowed || undefined}
                className="h-10 rounded-xl text-xs"
                {...register('quantity', {
                  required: true,
                  min: { value: 1, message: t('transfer.qtyMin') },
                  max: {
                    value: maxAllowed,
                    message: t('transfer.qtyMax').replace('{max}', String(maxAllowed)),
                  },
                  valueAsNumber: true,
                })}
              />
              {errors.quantity && (
                <p className="text-destructive text-xs">{errors.quantity.message as string}</p>
              )}
              {toStock && (
                <p className="text-muted-foreground text-[11px]">
                  {t('transfer.maxAllowed').replace('{max}', String(maxAllowed))}
                </p>
              )}
            </div>

            {/* Urgency Selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">{t('transfer.urgency')}</Label>
              <div className="flex gap-1.5">
                {URGENCY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setValue('urgency', opt.value)}
                    className={cn(
                      'flex-1 rounded-xl border py-2 text-xs font-semibold shadow-2xs transition-all',
                      selectedUrgency === opt.value
                        ? opt.value === 'high'
                          ? 'border-critical bg-critical text-critical-foreground'
                          : opt.value === 'low'
                            ? 'border-low bg-low text-low-foreground'
                            : 'border-primary bg-primary text-primary-foreground'
                        : 'border-border/80 text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                    )}
                  >
                    {t(`urgency.${opt.key}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-xs font-semibold">
              {t('transfer.notes')} ({t('common.optional')})
            </Label>
            <Textarea
              id="notes"
              rows={2}
              maxLength={280}
              placeholder="Tambahkan catatan transfer jika diperlukan..."
              className="rounded-xl text-xs"
              {...register('notes', { maxLength: 280 })}
            />
          </div>

          <DialogFooter className="gap-2 pt-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              className="gap-2 rounded-xl font-semibold shadow-sm"
              disabled={
                isSubmitting ||
                !selectedMedicineId ||
                !selectedQuantity ||
                selectedQuantity < 1 ||
                selectedQuantity > maxAllowed
              }
            >
              <Send className="size-4" />
              {t('transfer.submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
