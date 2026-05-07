import { createBrowserRouter } from 'react-router-dom'
import { checkAuthLoader } from './lib/auth'

export const router = createBrowserRouter([
  {
    path: '/',
    lazy: () => import('./features/landing/page').then((m) => ({ Component: m.default })),
  },
  {
    path: '/login',
    lazy: () => import('./features/auth/pages/login').then((m) => ({ Component: m.default })),
  },
  {
    path: '/register',
    lazy: () => import('./features/auth/pages/register').then((m) => ({ Component: m.default })),
  },
  {
    path: '/dashboard',
    lazy: () => import('./features/admin/pages/dashboard-layout').then((m) => ({ Component: m.default })),
    loader: checkAuthLoader,
    children: [
      {
        index: true,
        lazy: () => import('./features/admin/pages/overview').then((m) => ({ Component: m.default })),
      },
      {
        path: 'jwks',
        lazy: () => import('./features/admin/pages/jwks').then((m) => ({ Component: m.default })),
      },
      {
        path: 'clients',
        lazy: () => import('./features/admin/pages/clients').then((m) => ({ Component: m.default })),
      },
    ],
  },
])
