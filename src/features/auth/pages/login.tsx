import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layout } from "@/components/layout/layout";
import { login } from "@/lib/api";
import { isExternalUrl } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function Login() {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectUrl = searchParams.get("redirect_url") || searchParams.get("target") || "/dashboard"

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!password.trim()) {
      toast.error("Password is required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await login(name, password);

      if (response.ok) {
        toast.success("Login successful");
        if (isExternalUrl(redirectUrl)) {
          window.location.href = redirectUrl;
        } else {
          navigate(redirectUrl);
        }
      } else if (response.status === 401) {
        toast.error("Invalid credentials");
      } else {
        toast.error("Login failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setIsLoading(false);
    }
  }

  const registerLink = redirectUrl !== "/dashboard"
    ? `/register?redirect_url=${encodeURIComponent(redirectUrl)}`
    : "/register";

  return (
    <Layout>
      <div className="w-full max-w-md brutal-border-light bg-surface p-8">
        <div className="mb-8">
          <h2 className="text-4xl tracking-[0.1em] mb-2">Sign in</h2>
          <p className="text-sm font-mono text-muted">Enter your credentials to access the system</p>
          <div className="w-12 h-0.5 bg-foreground mt-4" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs tracking-[0.15em] uppercase font-mono">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs tracking-[0.15em] uppercase font-mono">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="font-mono text-sm"
            />
          </div>
          <Button type="submit" className="w-full brutal-border bg-foreground text-background hover:bg-transparent hover:text-foreground text-sm tracking-[0.15em] uppercase font-medium h-auto py-3" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <div className="mt-6 pt-6 brutal-border-top text-center">
          <span className="text-sm font-mono text-muted">
            Don&apos;t have an account?{" "}
          </span>
          <Link to={registerLink} className="text-sm font-mono text-foreground underline underline-offset-4 hover:text-muted transition-colors">
            Register
          </Link>
        </div>
      </div>
    </Layout>
  );
}
