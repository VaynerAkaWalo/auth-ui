import { memo, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { listIdentities, type Identity } from '@/lib/api'
import { Fingerprint, Loader2, AlertCircle, Copy, Check } from 'lucide-react'

const IdentityTableRow = memo(function IdentityTableRow({
  identity,
  index,
  total,
  copiedField,
  onCopy,
}: {
  identity: Identity
  index: number
  total: number
  copiedField: string | null
  onCopy: (id: string) => void
}) {
  return (
    <tr className={`${index < total - 1 ? 'brutal-border-bottom' : ''} hover:bg-elevated transition-colors`}>
      <td className="px-5 py-3 font-mono text-sm font-medium">{identity.name}</td>
      <td className="px-5 py-3">
        <button
          type="button"
          onClick={() => onCopy(identity.id)}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted hover:text-foreground transition-colors"
        >
          {identity.id.substring(0, 8)}...
          {copiedField === identity.id ? (
            <Check className="h-3 w-3" />
          ) : (
            <Copy className="h-3 w-3 shrink-0" />
          )}
        </button>
      </td>
      <td className="px-5 py-3 font-mono text-xs text-muted whitespace-nowrap">
        {new Date(identity.createdAt).toLocaleString()}
      </td>
      <td className="px-5 py-3 font-mono text-xs text-muted whitespace-nowrap">
        {new Date(identity.updatedAt).toLocaleString()}
      </td>
    </tr>
  )
})

export default function IdentitiesPage() {
  const [identities, setIdentities] = useState<Identity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    return () => clearTimeout(copyTimeoutRef.current)
  }, [])

  async function fetchIdentities() {
    try {
      const response = await listIdentities()
      if (response.ok) {
        const data: Identity[] = await response.json()
        setIdentities(data)
        setError(null)
      } else {
        const message = 'Failed to load identities'
        setError(message)
        toast.error(message)
      }
    } catch {
      const message = 'Network error while loading identities'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchIdentities()
  }, [])

  function handleCopy(id: string) {
    navigator.clipboard.writeText(id)
    setCopiedField(id)
    clearTimeout(copyTimeoutRef.current)
    copyTimeoutRef.current = setTimeout(() => setCopiedField(null), 2000)
  }

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

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl tracking-[0.1em] mb-2">Identities</h2>
        <p className="text-sm font-mono text-muted">Manage user identities</p>
        <div className="w-12 h-0.5 bg-foreground mt-4" />
      </div>

      <div className="brutal-border-light bg-surface">
        <div className="flex items-center gap-3 brutal-border-bottom px-5 py-3">
          <Fingerprint className="h-5 w-5 text-foreground shrink-0" />
          <h3 className="font-mono text-sm font-medium tracking-[0.1em] uppercase">All identities</h3>
          <span className="ml-auto text-xs font-mono text-muted">
            {identities.length === 0
              ? 'None registered'
              : `${identities.length} identit${identities.length === 1 ? 'y' : 'ies'}`}
          </span>
        </div>
        <div className="p-0">
          {identities.length === 0 ? (
            <div className="flex items-center justify-center h-24 text-sm font-mono text-muted">
              No identities found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="brutal-border-bottom">
                    <th className="text-left px-5 py-3 text-xs font-mono text-muted uppercase tracking-wider">Name</th>
                    <th className="text-left px-5 py-3 text-xs font-mono text-muted uppercase tracking-wider">ID</th>
                    <th className="text-left px-5 py-3 text-xs font-mono text-muted uppercase tracking-wider">Created</th>
                    <th className="text-left px-5 py-3 text-xs font-mono text-muted uppercase tracking-wider">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {identities.map((identity, i) => (
                    <IdentityTableRow
                      key={identity.id}
                      identity={identity}
                      index={i}
                      total={identities.length}
                      copiedField={copiedField}
                      onCopy={handleCopy}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
