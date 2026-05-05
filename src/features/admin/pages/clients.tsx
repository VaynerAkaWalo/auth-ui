import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [registeredClient, setRegisteredClient] =
    useState<RegisterClientResponse | null>(null)
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
      const response = await registerClient(name, domain, redirectURI)
      if (response.ok) {
        const data: RegisterClientResponse = await response.json()
        setRegisteredClient(data)
        setDialogOpen(true)
        setName('')
        setDomain('')
        setRedirectURI('')
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Clients</h1>
        <p className="text-muted-foreground">
          Manage OAuth2 relying-party clients
        </p>
      </div>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-lg">Register new client</CardTitle>
          <CardDescription>
            Create a new OAuth2 client for your application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My App"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="domain">Domain</Label>
                <Input
                  id="domain"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="example.com"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="redirectURI">Redirect URI</Label>
                <Input
                  id="redirectURI"
                  value={redirectURI}
                  onChange={(e) => setRedirectURI(e.target.value)}
                  placeholder="https://example.com/callback"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Register client
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Existing clients</CardTitle>
          </div>
          <CardDescription>
            {clients.length === 0
              ? 'No clients registered yet'
              : `${clients.length} client${clients.length === 1 ? '' : 's'} registered`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {clients.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              No clients found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Redirect URI</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.domain}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {client.redirectURI}
                    </TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {new Date(client.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Client registered</DialogTitle>
            <DialogDescription>
              Copy these credentials now. The client secret will not be shown again.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Client ID</Label>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={registeredClient?.clientId ?? ''}
                  className="font-mono"
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
                >
                  {copiedField === 'clientId' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Client Secret</Label>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  type="password"
                  value={registeredClient?.clientSecret ?? ''}
                  className="font-mono"
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
                >
                  {copiedField === 'clientSecret' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
