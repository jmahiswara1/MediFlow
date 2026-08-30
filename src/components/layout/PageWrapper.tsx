import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
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

  // Sidebar width: 16rem expanded + 12px gap + 12px page padding-left = 17rem
  // Collapsed: 5rem + 12px + 12px = 6rem
  const mainPaddingLeft = collapsed ? '6rem' : '17rem'

  return (
    <div
      className={cn(
        'bg-background p-3',
        isFullHeight ? 'h-screen overflow-hidden' : 'min-h-screen',
      )}
    >
      <Sidebar />
      <div
        className={cn('flex flex-col gap-3', isFullHeight && 'h-full overflow-hidden')}
        style={{ paddingLeft: mainPaddingLeft, transition: 'padding-left 200ms ease-out' }}
      >
        <Navbar />
        <main
          key={location.pathname}
          className={cn(
            'bg-card/85 border-border motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 flex-1 rounded-2xl border p-6 shadow-sm backdrop-blur-xl duration-200 md:p-8',
            isFullHeight && 'flex min-h-0 flex-col overflow-hidden p-3 sm:p-4 md:p-5',
          )}
        >
          <Outlet />
        </main>
      </div>
      {currentUser && !isTeamChatPage && (
        <>
          <div data-fab-chat>
            <FloatingChatButton open={popoverOpen} onToggle={() => setPopoverOpen((v) => !v)} />
          </div>
          <TeamChatPopover open={popoverOpen} onClose={() => setPopoverOpen(false)} />
        </>
      )}
    </div>
  )
}
