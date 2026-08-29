import type { ReactNode } from 'react'
import type { UserRole } from '@/types'
import { useRole } from '@/store'

interface RoleGateProps {
  role: UserRole | UserRole[]
  children: ReactNode
  fallback?: ReactNode
}

export function RoleGate({ role, children, fallback = null }: RoleGateProps) {
  const currentRole = useRole()

  if (!currentRole) return <>{fallback}</>

  const allowed = Array.isArray(role)
    ? role.includes(currentRole)
    : currentRole === role

  return allowed ? <>{children}</> : <>{fallback}</>
}