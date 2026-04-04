import { createBrowserRouter, Navigate } from 'react-router-dom'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import Dashboard from './features/admin/pages/Dashboard'
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
