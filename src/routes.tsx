import { createBrowserRouter, Navigate } from 'react-router-dom'
import Login from './features/auth/pages/login'
import Register from './features/auth/pages/register'
import Dashboard from './features/admin/pages/dashboard'
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
    element: <Dashboard />,
    loader: checkAuthLoader,
  },
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
])
