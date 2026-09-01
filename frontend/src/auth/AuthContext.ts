import { createContext } from 'react'

import type {
  AdminAuthResponse,
  AdminLoginRequest,
} from '../types/auth'

export type AuthStatus =
  | 'loading'
  | 'authenticated'
  | 'anonymous'
  | 'error'

export interface AuthContextValue {
  admin: AdminAuthResponse | null
  status: AuthStatus

  login: (
    request: AdminLoginRequest,
  ) => Promise<AdminAuthResponse>

  logout: () => Promise<void>

  refreshAuth: () => Promise<void>
}

const AuthContext =
  createContext<AuthContextValue | null>(null)

export default AuthContext