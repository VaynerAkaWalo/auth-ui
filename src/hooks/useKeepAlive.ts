import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { whoAmI } from '@/lib/api'

interface UseKeepAliveOptions {
  interval?: number
}

export function useKeepAlive(options: UseKeepAliveOptions = {}) {
  const { interval = 60000 } = options
  const navigate = useNavigate()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await whoAmI()
        if (!response.ok) {
          toast.error('Session expired')
          navigate('/login')
        }
      } catch {
        toast.error('Network error')
        navigate('/login')
      }
    }

    intervalRef.current = setInterval(checkSession, interval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [navigate, interval])
}
