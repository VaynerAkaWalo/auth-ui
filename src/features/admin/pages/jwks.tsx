import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-destructive gap-2">
        <AlertCircle className="h-5 w-5" />
        <span>{error}</span>
      </div>
    )
  }

  if (keys.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No JWKS keys found
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">JWKS Keys</h1>
        <p className="text-muted-foreground">Public signing keys exposed via the JWKS endpoint</p>
      </div>
      <div className="grid gap-4">
        {keys.map((key) => (
          <Card key={key.kid}>
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg font-mono">{key.kid}</CardTitle>
              </div>
              <CardDescription>
                {key.alg} / {key.kty}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                <span className="text-muted-foreground whitespace-nowrap">Algorithm</span>
                <span className="font-mono">{key.alg}</span>

                <span className="text-muted-foreground whitespace-nowrap">Type</span>
                <span className="font-mono">{key.kty}</span>

                <span className="text-muted-foreground whitespace-nowrap">Use</span>
                <span className="font-mono">{key.use}</span>

                <span className="text-muted-foreground whitespace-nowrap">Modulus (n)</span>
                <span className="font-mono break-all text-xs">{key.n}</span>

                <span className="text-muted-foreground whitespace-nowrap">Exponent (e)</span>
                <span className="font-mono break-all text-xs">{key.e}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
