import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { getJwks, type JWK, type JwksResponse } from '@/lib/api'
import { KeyRound, Loader2, AlertCircle } from 'lucide-react'

export default function JwksViewer() {
  const [keys, setKeys] = useState<JWK[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchJwks() {
      try {
        const response = await getJwks()
        if (response.ok) {
          const data: JwksResponse = await response.json()
          setKeys(data.keys)
        } else {
          setError('Failed to load JWKS keys')
          toast.error('Failed to load JWKS keys')
        }
      } catch {
        setError('Network error while loading JWKS keys')
        toast.error('Network error while loading JWKS keys')
      } finally {
        setIsLoading(false)
      }
    }

    fetchJwks()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-destructive gap-3">
        <AlertCircle className="h-5 w-5" />
        <span className="font-mono text-sm">{error}</span>
      </div>
    )
  }

  if (keys.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-sm font-mono text-muted">No JWKS keys found</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-4xl tracking-[0.1em] mb-2">JWKS Keys</h2>
        <p className="text-sm font-mono text-muted">Public signing keys exposed via the JWKS endpoint</p>
        <div className="w-12 h-0.5 bg-foreground mt-4" />
      </div>

      <div className="grid gap-4">
        {keys.map((key) => (
          <div key={key.kid} className="brutal-border-light bg-surface">
            <div className="flex items-center gap-3 brutal-border-bottom px-5 py-3">
              <KeyRound className="h-5 w-5 text-foreground shrink-0" />
              <h3 className="font-mono text-sm font-medium tracking-tight uppercase">{key.kid}</h3>
              <span className="ml-auto text-xs font-mono text-muted">{key.alg} / {key.kty}</span>
            </div>
            <div className="p-5 space-y-3">
              <div className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 text-sm">
                <span className="text-xs font-mono text-muted uppercase tracking-wider">Algorithm</span>
                <span className="font-mono">{key.alg}</span>

                <span className="text-xs font-mono text-muted uppercase tracking-wider">Type</span>
                <span className="font-mono">{key.kty}</span>

                <span className="text-xs font-mono text-muted uppercase tracking-wider">Use</span>
                <span className="font-mono">{key.use}</span>

                <span className="text-xs font-mono text-muted uppercase tracking-wider">Modulus (n)</span>
                <span className="font-mono break-all text-xs leading-relaxed">{key.n}</span>

                <span className="text-xs font-mono text-muted uppercase tracking-wider">Exponent (e)</span>
                <span className="font-mono break-all text-xs leading-relaxed">{key.e}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
