import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { StockMapPage } from '@/features/stock-map/StockMapPage'
import { TransferPage } from '@/features/transfer/TransferPage'
import { AnalyticsPage } from '@/features/analytics/AnalyticsPage'
import { AiChatPage } from '@/features/ai-chat/AiChatPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PageWrapper />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'stock-map', element: <StockMapPage /> },
      { path: 'transfer', element: <TransferPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'ai-chat', element: <AiChatPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
