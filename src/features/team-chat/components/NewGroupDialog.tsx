import { useMemo, useState } from 'react'
import { Building2, Check, Search, ShieldCheck, Users, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useI18n } from '@/i18n/useI18n'
import { useCurrentUser, useTeamChatStore } from '@/store'
import { userList } from '@/data/users'
import { isUserOnline } from '../utils/conversationHelpers'
import { cn } from '@/lib/utils'

interface NewGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated?: (conversationId: string) => void
}

export function NewGroupDialog({ open, onOpenChange, onCreated }: NewGroupDialogProps) {
  const { t } = useI18n()
  const currentUser = useCurrentUser()
  const createGroup = useTeamChatStore((s) => s.createGroup)

  const [groupName, setGroupName] = useState('')
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const others = useMemo(() => userList.filter((u) => u.id !== currentUser?.id), [currentUser])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return others
    return others.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.hospitalName.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q),
    )
  }, [others, search])

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const handleCreate = () => {
    if (!currentUser) return
    if (!groupName.trim() || selectedIds.length < 2) return

    const groupId = createGroup({
      name: groupName.trim(),
      memberIds: selectedIds,
      createdBy: currentUser.id,
    })

    if (groupId) {
      onCreated?.(groupId)
      handleClose()
    }
  }

  const handleClose = () => {
    setGroupName('')
    setSearch('')
    setSelectedIds([])
    onOpenChange(false)
  }

  const canSubmit = groupName.trim().length > 0 && selectedIds.length >= 2

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl">
        {/* Header */}
        <DialogHeader className="border-border/70 bg-muted/30 border-b p-5">
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-600 shadow-2xs dark:text-indigo-400">
              <Users className="size-5" />
            </span>
            <div className="min-w-0 flex-1 pr-6">
              <DialogTitle className="text-base leading-snug font-bold">
                {t('teamChat.newGroupDialog.title')}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground pt-0.5 text-xs leading-normal">
                {t('teamChat.newGroupDialog.description')}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Content Body */}
        <div className="space-y-4 px-5 py-4">
          {/* Group Name Input */}
          <div className="space-y-1.5">
            <label className="text-foreground text-xs font-bold">
              {t('teamChat.newGroupDialog.groupName')} <span className="text-critical">*</span>
            </label>
            <Input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder={t('teamChat.newGroupDialog.groupNamePlaceholder')}
              className="bg-muted/40 border-border/70 h-10 rounded-xl text-xs focus-visible:border-indigo-500 sm:text-sm"
              autoFocus
            />
          </div>

          {/* Member Selection Section */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-foreground text-xs font-bold">
                {t('teamChat.newGroupDialog.selectMembers')}
              </label>
              <span
                className={cn(
                  'text-[11px] tabular-nums',
                  selectedIds.length >= 2
                    ? 'font-bold text-indigo-600 dark:text-indigo-400'
                    : 'text-muted-foreground font-medium',
                )}
              >
                {t('teamChat.newGroupDialog.selectedCount', { count: selectedIds.length })}
              </span>
            </div>

            {/* Selected Members Chips */}
            {selectedIds.length > 0 && (
              <div className="flex max-h-20 flex-wrap gap-1.5 overflow-y-auto pb-1">
                {selectedIds.map((id) => {
                  const u = userList.find((x) => x.id === id)
                  if (!u) return null
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/15 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 shadow-2xs dark:text-indigo-300"
                    >
                      <span className="max-w-[130px] truncate">{u.name}</span>
                      <button
                        type="button"
                        onClick={() => toggleSelect(id)}
                        className="-mr-1 flex size-4 items-center justify-center rounded-full transition-colors hover:bg-indigo-500/25"
                        aria-label="Hapus pilihan"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  )
                })}
              </div>
            )}

            {/* Search Box */}
            <div className="bg-muted/50 border-border/70 focus-within:bg-card flex h-9.5 items-center gap-2 rounded-xl border px-3 shadow-2xs transition-all focus-within:border-indigo-500">
              <Search className="text-muted-foreground size-3.5 shrink-0" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('teamChat.newGroupDialog.searchPlaceholder')}
                className="placeholder:text-muted-foreground/60 min-w-0 flex-1 bg-transparent text-xs outline-none"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="text-muted-foreground hover:text-foreground flex size-4 items-center justify-center rounded-full"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>

            {/* Member List */}
            <div className="border-border/60 max-h-52 scrollbar-thin overflow-y-auto rounded-xl border p-1">
              {filtered.length === 0 ? (
                <div className="text-muted-foreground py-6 text-center text-xs">
                  {t('teamChat.newGroupDialog.noUsersFound')}
                </div>
              ) : (
                filtered.map((u) => {
                  const isSelected = selectedIds.includes(u.id)
                  const online = isUserOnline(u)

                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => toggleSelect(u.id)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl p-2 text-left transition-all',
                        isSelected
                          ? 'text-foreground bg-indigo-500/10 font-semibold'
                          : 'hover:bg-muted/60 text-foreground/90',
                      )}
                    >
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <span
                          className={cn(
                            'flex size-8.5 items-center justify-center rounded-xl text-xs font-bold shadow-2xs transition-colors',
                            isSelected ? 'bg-indigo-600 text-white' : 'bg-primary/15 text-primary',
                          )}
                        >
                          {u.avatarSeed}
                        </span>
                        <span
                          className={cn(
                            'ring-card absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full ring-2',
                            online ? 'bg-safe' : 'bg-muted-foreground/30',
                          )}
                        />
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-xs font-bold">{u.name}</p>
                          <span className="bg-muted text-muted-foreground inline-flex items-center gap-0.5 rounded px-1 py-0.5 text-[9px] font-semibold">
                            <ShieldCheck className="size-2.5" />
                            <span>
                              {u.role === 'requester'
                                ? t('userMenu.roleRequester')
                                : t('userMenu.roleApprover')}
                            </span>
                          </span>
                        </div>
                        <p className="text-muted-foreground flex items-center gap-1 truncate text-[10px]">
                          <Building2 className="size-2.5 shrink-0 opacity-60" />
                          <span className="truncate">{u.hospitalName}</span>
                        </p>
                      </div>

                      {/* Checkbox Icon */}
                      <span
                        className={cn(
                          'flex size-5 shrink-0 items-center justify-center rounded-lg border transition-all',
                          isSelected
                            ? 'border-indigo-600 bg-indigo-600 text-white shadow-2xs'
                            : 'border-border/80 text-transparent',
                        )}
                      >
                        <Check className="size-3 stroke-[3]" />
                      </span>
                    </button>
                  )
                })
              )}
            </div>
            {selectedIds.length < 2 && (
              <p className="text-muted-foreground px-0.5 text-[11px] italic">
                * {t('teamChat.newGroupDialog.minMembersHint')}
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions with generous padding and clean button gap */}
        <div className="border-border/70 bg-muted/30 flex items-center justify-end gap-2.5 border-t px-5 py-3.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClose}
            className="cursor-pointer rounded-xl px-4 py-2 text-xs font-semibold"
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleCreate}
            disabled={!canSubmit}
            className="cursor-pointer rounded-xl bg-indigo-600 px-4.5 py-2 text-xs font-bold text-white shadow-2xs transition-all hover:bg-indigo-700 disabled:opacity-50"
          >
            {t('teamChat.newGroupDialog.create')}
            {selectedIds.length > 0 && ` (${selectedIds.length})`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
