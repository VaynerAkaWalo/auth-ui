import { createBrowserRouter, Navigate } from 'react-router-dom'
import Login from './features/auth/pages/login'
import Register from './features/auth/pages/register'
import DashboardLayout from './features/admin/pages/dashboard-layout'
import Overview from './features/admin/pages/overview'
import JwksViewer from './features/admin/pages/jwks'
import { checkAuthLoader } from './lib/auth'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    loader: checkAuthLoader,
    children: [
      {
        index: true,
        element: <Overview />,
      },
      {
        path: 'jwks',
        element: <JwksViewer />,
      },
    ],
  },
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
])
