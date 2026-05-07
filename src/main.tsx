import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import { router } from './routes'
import { ErrorBoundary } from './components/error-boundary'
import { Loader2 } from 'lucide-react'
import './styles/globals.css'

document.documentElement.classList.add('dark')

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin text-foreground mx-auto mb-4" />
      <p className="text-sm font-mono text-muted tracking-widest uppercase">Loading...</p>
    </div>
  </div>
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <RouterProvider router={router} />
      </Suspense>
      <Toaster
        position="top-center"
        richColors
        theme="dark"
      />
    </ErrorBoundary>
  </React.StrictMode>
)
