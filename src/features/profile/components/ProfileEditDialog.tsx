import { useState } from 'react'
import { Check, Pencil } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore, useCurrentUser } from '@/store'
import { useI18n } from '@/i18n/useI18n'
import type { User } from '@/types'

interface ProfileEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileEditDialog({ open, onOpenChange }: ProfileEditDialogProps) {
  const user = useCurrentUser()

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && <ProfileEditForm user={user} onClose={() => onOpenChange(false)} />}
    </Dialog>
  )
}

interface ProfileEditFormProps {
  user: User
  onClose: () => void
}

function ProfileEditForm({ user, onClose }: ProfileEditFormProps) {
  const { t } = useI18n()
  const updateUser = useAuthStore((s) => s.updateUser)

  const [name, setName] = useState(user.name || '')
  const [email, setEmail] = useState(user.email || '')
  const [phone, setPhone] = useState(user.phone || '')
  const [department, setDepartment] = useState(user.department || '')
  const [specialty, setSpecialty] = useState(user.specialty || '')
  const [licenseNumber, setLicenseNumber] = useState(user.licenseNumber || '')
  const [bio, setBio] = useState(user.bio || '')

  const handleSave = () => {
    if (!name.trim()) return

    updateUser(user.id, {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      department: department.trim(),
      specialty: specialty.trim(),
      licenseNumber: licenseNumber.trim(),
      bio: bio.trim(),
    })

    toast.success(t('profile.toastUpdated'))
    onClose()
  }

  return (
    <DialogContent className="max-w-lg gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl">
      {/* Header */}
      <DialogHeader className="border-border/70 bg-muted/30 border-b p-5">
        <div className="flex items-center gap-3">
          <span className="bg-primary/15 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl shadow-2xs">
            <Pencil className="size-5" />
          </span>
          <div className="min-w-0 flex-1 pr-6">
            <DialogTitle className="text-base leading-snug font-bold">
              {t('profile.editProfile')}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground pt-0.5 text-xs leading-normal">
              {t('profile.editProfileDesc')}
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      {/* Form Body */}
      <div className="max-h-[65vh] scrollbar-thin space-y-4 overflow-y-auto px-5 py-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-foreground text-xs font-bold">
            {t('profile.fullName')} <span className="text-critical">*</span>
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: dr. Andi Pratama, Sp.A(K)"
            className="bg-muted/40 border-border/70 focus-visible:border-primary h-10 rounded-xl text-xs sm:text-sm"
            autoFocus
          />
        </div>

        {/* Email & Phone Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-foreground text-xs font-bold">{t('profile.email')}</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@faskes.co.id"
              className="bg-muted/40 border-border/70 focus-visible:border-primary h-10 rounded-xl text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-foreground text-xs font-bold">{t('profile.phone')}</label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+62 812-xxxx-xxxx"
              className="bg-muted/40 border-border/70 focus-visible:border-primary h-10 rounded-xl text-xs"
            />
          </div>
        </div>

        {/* Department & Specialty Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-foreground text-xs font-bold">{t('profile.department')}</label>
            <Input
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Contoh: Instalasi Farmasi"
              className="bg-muted/40 border-border/70 focus-visible:border-primary h-10 rounded-xl text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-foreground text-xs font-bold">{t('profile.specialty')}</label>
            <Input
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder="Contoh: Kepala Pengadaan"
              className="bg-muted/40 border-border/70 focus-visible:border-primary h-10 rounded-xl text-xs"
            />
          </div>
        </div>

        {/* License Number (STR / SIP) */}
        <div className="space-y-1.5">
          <label className="text-foreground text-xs font-bold">{t('profile.licenseNumber')}</label>
          <Input
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            placeholder="Contoh: STRA-3578-2018-4921"
            className="bg-muted/40 border-border/70 focus-visible:border-primary h-10 rounded-xl text-xs"
          />
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <label className="text-foreground text-xs font-bold">{t('profile.bio')}</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="Deskripsi singkat mengenai peran atau fokus tugas klinis Anda..."
            className="bg-muted/40 border-border/70 focus-visible:border-primary placeholder:text-muted-foreground/60 w-full resize-none rounded-xl border p-2.5 text-xs outline-none"
          />
        </div>
      </div>

      {/* Footer Actions */}
      {/* Footer Actions */}
      <div className="border-border/70 bg-muted/30 flex items-center justify-end gap-2.5 border-t px-5 py-3.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          className="cursor-pointer rounded-xl px-4 py-2 text-xs font-semibold"
        >
          {t('common.cancel')}
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={handleSave}
          disabled={!name.trim()}
          className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer gap-1.5 rounded-xl px-4.5 py-2 text-xs font-bold shadow-2xs transition-all disabled:opacity-50"
        >
          <Check className="size-3.5" />
          <span>{t('profile.saveChanges')}</span>
        </Button>
      </div>
    </DialogContent>
  )
}
