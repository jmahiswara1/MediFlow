import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { AuthGate } from '@/components/auth/AuthGate'
import { LoginPage } from '@/features/auth/LoginPage'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { NetworkPage } from '@/features/network/NetworkPage'
import { AnalyticsPage } from '@/features/analytics/AnalyticsPage'
import { AiChatPage } from '@/features/ai-chat/AiChatPage'
import { NotificationsPage } from '@/features/notifications/NotificationsPage'
import { TeamChatPage } from '@/features/team-chat/TeamChatPage'
import { ProfilePage } from '@/features/profile/ProfilePage'
import { SettingsPage } from '@/features/settings/SettingsPage'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: (
      <AuthGate>
        <Outlet />
      </AuthGate>
    ),
    children: [
      {
        element: <PageWrapper />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'network', element: <NetworkPage /> },
          { path: 'analytics', element: <AnalyticsPage /> },
          { path: 'assistant', element: <AiChatPage /> },
          { path: 'chat', element: <TeamChatPage /> },
          { path: 'ai-chat', element: <Navigate to="/assistant" replace /> },
          { path: 'notifications', element: <NotificationsPage /> },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'settings', element: <SettingsPage /> },
          { path: '*', element: <Navigate to="/" replace /> },
        ],
      },
    ],
  },
])
