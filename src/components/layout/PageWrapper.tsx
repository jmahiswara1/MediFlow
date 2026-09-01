import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { BottomNav } from '@/components/layout/BottomNav'
import { FloatingChatButton } from '@/features/team-chat/FloatingChatButton'
import { TeamChatPopover } from '@/features/team-chat/TeamChatPopover'
import { useUiStore } from '@/store'
import { useCurrentUser } from '@/store'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function PageWrapper() {
  const location = useLocation()
  const collapsed = useUiStore((s) => s.sidebarCollapsed)
  const isChatPage = location.pathname.startsWith('/assistant')
  const isTeamChatPage = location.pathname.startsWith('/chat')
  const isFullHeight = isChatPage || isTeamChatPage
  const currentUser = useCurrentUser()
  const [popoverOpen, setPopoverOpen] = useState(false)

  return (
    <div
      className={cn(
        'bg-background p-2 sm:p-3',
        isFullHeight ? 'h-screen overflow-hidden' : 'min-h-screen pb-20 md:pb-3',
      )}
    >
      <Sidebar />
      <div
        className={cn(
          'flex flex-col gap-2.5 transition-[padding] duration-200 ease-out sm:gap-3',
          collapsed ? 'md:pl-[6rem]' : 'md:pl-[17rem]',
          isFullHeight && 'h-full overflow-hidden',
        )}
      >
        <Navbar />
        <main
          key={location.pathname}
          className={cn(
            'bg-card/85 border-border motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 flex-1 rounded-2xl border p-3.5 shadow-sm backdrop-blur-xl duration-200 sm:p-5 md:p-8',
            isFullHeight && 'flex min-h-0 flex-col overflow-hidden p-2.5 sm:p-4 md:p-5',
          )}
        >
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav />

      {currentUser && !isTeamChatPage && (
        <>
          <div data-fab-chat className="hidden sm:block">
            <FloatingChatButton open={popoverOpen} onToggle={() => setPopoverOpen((v) => !v)} />
          </div>
          <TeamChatPopover open={popoverOpen} onClose={() => setPopoverOpen(false)} />
        </>
      )}
    </div>
  )
}
