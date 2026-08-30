import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { useUiStore } from '@/store'

export function PageWrapper() {
  const location = useLocation()
  const collapsed = useUiStore((s) => s.sidebarCollapsed)

  // Sidebar width: 16rem expanded + 12px gap + 12px page padding-left = 17rem
  // Collapsed: 5rem + 12px + 12px = 6rem
  const mainPaddingLeft = collapsed ? '6rem' : '17rem'

  return (
    <div className="bg-background min-h-screen p-3">
      <Sidebar />
      <div
        className="flex flex-col gap-3"
        style={{ paddingLeft: mainPaddingLeft, transition: 'padding-left 200ms ease-out' }}
      >
        <Navbar />
        <main
          key={location.pathname}
          className="bg-card/85 border-border motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 flex-1 rounded-2xl border p-6 shadow-sm backdrop-blur-xl duration-200 md:p-8"
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
