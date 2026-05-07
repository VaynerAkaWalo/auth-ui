import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  listClients,
  registerClient,
  ClientType,
  type Client,
  type RegisterClientResponse,
} from '@/lib/api'
import { Users, Loader2, AlertCircle, Copy, Check } from 'lucide-react'

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [domain, setDomain] = useState('')
  const [redirectURI, setRedirectURI] = useState('')
  const [type, setType] = useState<ClientType>(ClientType.Public)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [registeredClient, setRegisteredClient] =
    useState<RegisterClientResponse | null>(null)
  const [registeredClientType, setRegisteredClientType] =
    useState<ClientType | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  async function fetchClients() {
    try {
      const response = await listClients()
      if (response.ok) {
        const data: Client[] = await response.json()
        setClients(data)
        setError(null)
      } else {
        const message = 'Failed to load clients'
        setError(message)
        toast.error(message)
      }
    } catch {
      const message = 'Network error while loading clients'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!name.trim()) {
      toast.error('Name is required')
      return
    }
    if (!domain.trim()) {
      toast.error('Domain is required')
      return
    }
    if (!redirectURI.trim()) {
      toast.error('Redirect URI is required')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await registerClient(name, domain, redirectURI, type)
      if (response.ok) {
        const data: RegisterClientResponse = await response.json()
        setRegisteredClient(data)
        setRegisteredClientType(type)
        setDialogOpen(true)
        setName('')
        setDomain('')
        setRedirectURI('')
        setType(ClientType.Public)
        await fetchClients()
      } else {
        let message = 'Failed to register client'
        try {
          const err = await response.json()
          if (err.message) message = err.message
        } catch {
          // ignore
        }
        toast.error(message)
      }
    } catch {
      toast.error('Network error while registering client')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleCopy(field: string, value: string) {
    navigator.clipboard.writeText(value)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
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
        <h2 className="text-4xl tracking-[0.1em] mb-2">Clients</h2>
        <p className="text-sm font-mono text-muted">Manage OAuth2 relying-party clients</p>
        <div className="w-12 h-0.5 bg-foreground mt-4" />
      </div>

      <div className="brutal-border-light bg-surface">
        <div className="brutal-border-bottom px-5 py-3">
          <h3 className="font-mono text-sm font-medium tracking-[0.1em] uppercase">Register new client</h3>
        </div>
        <div className="p-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs tracking-[0.15em] uppercase font-mono">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My App"
                  disabled={isSubmitting}
                  className="font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="domain" className="text-xs tracking-[0.15em] uppercase font-mono">Domain</Label>
                <Input
                  id="domain"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="example.com"
                  disabled={isSubmitting}
                  className="font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="redirectURI" className="text-xs tracking-[0.15em] uppercase font-mono">Redirect URI</Label>
                <Input
                  id="redirectURI"
                  value={redirectURI}
                  onChange={(e) => setRedirectURI(e.target.value)}
                  placeholder="https://example.com/callback"
                  disabled={isSubmitting}
                  className="font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type" className="text-xs tracking-[0.15em] uppercase font-mono">Type</Label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value as ClientType)}
                  disabled={isSubmitting}
                  className="flex h-10 w-full rounded-none border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value={ClientType.Confidential}>confidential</option>
                  <option value={ClientType.Public}>public</option>
                </select>
              </div>
            </div>
            <Button type="submit" disabled={isSubmitting} className="brutal-border bg-foreground text-background hover:bg-transparent hover:text-foreground text-xs tracking-[0.15em] uppercase font-mono h-auto py-3 px-6">
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Register client
            </Button>
          </form>
        </div>
      </div>

      <div className="brutal-border-light bg-surface">
        <div className="flex items-center gap-3 brutal-border-bottom px-5 py-3">
          <Users className="h-5 w-5 text-foreground shrink-0" />
          <h3 className="font-mono text-sm font-medium tracking-[0.1em] uppercase">Existing clients</h3>
          <span className="ml-auto text-xs font-mono text-muted">
            {clients.length === 0
              ? 'None registered'
              : `${clients.length} client${clients.length === 1 ? '' : 's'}`}
          </span>
        </div>
        <div className="p-0">
          {clients.length === 0 ? (
            <div className="flex items-center justify-center h-24 text-sm font-mono text-muted">
              No clients found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="brutal-border-bottom">
                    <th className="text-left px-5 py-3 text-xs font-mono text-muted uppercase tracking-wider">Name</th>
                    <th className="text-left px-5 py-3 text-xs font-mono text-muted uppercase tracking-wider">Domain</th>
                    <th className="text-left px-5 py-3 text-xs font-mono text-muted uppercase tracking-wider">Redirect URI</th>
                    <th className="text-left px-5 py-3 text-xs font-mono text-muted uppercase tracking-wider">Type</th>
                    <th className="text-left px-5 py-3 text-xs font-mono text-muted uppercase tracking-wider">Client ID</th>
                    <th className="text-left px-5 py-3 text-xs font-mono text-muted uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client, i) => (
                    <tr key={client.id} className={`${i < clients.length - 1 ? 'brutal-border-bottom' : ''} hover:bg-elevated transition-colors`}>
                      <td className="px-5 py-3 font-mono text-sm font-medium">{client.name}</td>
                      <td className="px-5 py-3 font-mono text-sm">{client.domain}</td>
                      <td className="px-5 py-3 font-mono text-xs break-all">{client.redirectURI}</td>
                      <td className="px-5 py-3 font-mono text-xs uppercase tracking-wider">{client.type}</td>
                      <td className="px-5 py-3">
                        <button
                          type="button"
                          onClick={() => handleCopy(client.id, client.id)}
                          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted hover:text-foreground transition-colors"
                        >
                          {client.id.substring(0, 8)}...
                          {copiedField === client.id ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3 shrink-0" />
                          )}
                        </button>
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-muted whitespace-nowrap">
                        {new Date(client.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="brutal-border-light bg-surface">
          <DialogHeader>
            <DialogTitle className="font-mono text-sm tracking-[0.1em] uppercase">Client registered</DialogTitle>
            {registeredClientType === ClientType.Confidential ? (
              <DialogDescription className="font-mono text-xs text-muted">
                Copy these credentials now. The client secret will not be shown again.
              </DialogDescription>
            ) : null}
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs tracking-[0.15em] uppercase font-mono">Client ID</Label>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={registeredClient?.clientId ?? ''}
                  className="font-mono text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    handleCopy(
                      'clientId',
                      registeredClient?.clientId ?? ''
                    )
                  }
                  className="rounded-none"
                >
                  {copiedField === 'clientId' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            {registeredClientType === ClientType.Confidential ? (
              <div className="space-y-2">
                <Label className="text-xs tracking-[0.15em] uppercase font-mono">Client Secret</Label>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    type="password"
                    value={registeredClient?.clientSecret ?? ''}
                    className="font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleCopy(
                        'clientSecret',
                        registeredClient?.clientSecret ?? ''
                      )
                    }
                    className="rounded-none"
                  >
                    {copiedField === 'clientSecret' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)} className="brutal-border bg-foreground text-background hover:bg-transparent hover:text-foreground text-xs tracking-[0.15em] uppercase font-mono h-auto py-2 px-5">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
