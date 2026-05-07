import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layout } from "@/components/layout/layout";
import { register } from "@/lib/api";
import { isExternalUrl } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") || searchParams.get("target");

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
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await register(name, password);

      if (response.ok) {
        toast.success("Account created successfully");
        const loginLink = redirectUrl
          ? `/login?redirect_url=${encodeURIComponent(redirectUrl)}`
          : "/login";
        if (redirectUrl && isExternalUrl(redirectUrl)) {
          const externalLoginLink = `${window.location.origin}${loginLink}`;
          window.location.href = externalLoginLink;
        } else {
          navigate(loginLink);
        }
      } else if (response.status === 409) {
        toast.error("Identity with this name already exists");
      } else if (response.status === 400) {
        const data = await response.json().catch(() => null);
        toast.error(data?.message || "Invalid request");
      } else {
        toast.error("Registration failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setIsLoading(false);
    }
  }

  const loginLink = redirectUrl
    ? `/login?redirect_url=${encodeURIComponent(redirectUrl)}`
    : "/login";

  return (
    <Layout>
      <div className="w-full max-w-md brutal-border-light bg-surface p-8">
        <div className="mb-8">
          <h2 className="text-4xl tracking-[0.1em] mb-2">Register</h2>
          <p className="text-sm font-mono text-muted">Create a new account to access the system</p>
          <div className="w-12 h-0.5 bg-foreground mt-4" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs tracking-[0.15em] uppercase font-mono">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Choose a name"
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
              placeholder="Choose a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-xs tracking-[0.15em] uppercase font-mono">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              className="font-mono text-sm"
            />
          </div>
          <Button type="submit" className="w-full brutal-border bg-foreground text-background hover:bg-transparent hover:text-foreground text-sm tracking-[0.15em] uppercase font-medium h-auto py-3" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>

        <div className="mt-6 pt-6 brutal-border-top text-center">
          <span className="text-sm font-mono text-muted">
            Already have an account?{" "}
          </span>
          <Link to={loginLink} className="text-sm font-mono text-foreground underline underline-offset-4 hover:text-muted transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </Layout>
  );
}
