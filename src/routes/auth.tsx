import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Search = { redirect?: string | undefined };

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    redirect: typeof s["redirect"] === "string" ? (s["redirect"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in — Outreach AI" },
      { name: "description", content: "Sign in to your AI SDR workspace." },
      { property: "og:title", content: "Sign in — Outreach AI" },
      { property: "og:description", content: "Sign in to your AI SDR workspace." },
    ],
  }),
  component: AuthPage,
});

function safePath(p?: string) {
  if (!p) return "/dashboard";
  try {
    const u = new URL(p, window.location.origin);
    return u.origin === window.location.origin ? u.pathname + u.search : "/dashboard";
  } catch {
    return "/dashboard";
  }
}

function AuthPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up" | "forgot">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: safePath(redirect) as "/dashboard" });
    });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: safePath(redirect) as "/dashboard" });
      } else if (mode === "up") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin + "/dashboard", data: { full_name: name } },
        });
        if (error) throw error;
        setSent("Check your inbox to confirm your email, then sign in.");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + "/reset-password",
        });
        if (error) throw error;
        setSent("If an account exists, a reset link is on its way.");
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-brand-gradient p-12 text-primary-foreground lg:flex">
        <div className="flex items-center gap-2 font-display text-xl font-semibold">
          <Sparkles className="size-5" /> Outreach AI
        </div>
        <div>
          <h1 className="text-4xl font-semibold leading-tight">AI SDRs that research, qualify and reach out — for every brand you run.</h1>
          <p className="mt-4 max-w-md opacity-80">Email, LinkedIn and AI calls, grounded in your own documents.</p>
        </div>
        <p className="text-sm opacity-60">© {new Date().getFullYear()} Outreach AI</p>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-semibold">
            {mode === "in" ? "Welcome back" : mode === "up" ? "Create your account" : "Reset password"}
          </h2>
          {sent ? (
            <div className="mt-6 rounded-xl bg-sky p-4 text-sm">{sent}
              <Button variant="link" className="px-0" onClick={() => { setSent(null); setMode("in"); }}>Back to sign in</Button>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-6 space-y-4">
              {mode === "up" && (
                <div className="space-y-2"><Label htmlFor="name">Full name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required /></div>
              )}
              <div className="space-y-2"><Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
              {mode !== "forgot" && (
                <div className="space-y-2"><Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
              )}
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? "Please wait…" : mode === "in" ? "Sign in" : mode === "up" ? "Create account" : "Send reset link"}
              </Button>
              <div className="flex justify-between text-sm">
                {mode === "in" ? (
                  <>
                    <button type="button" className="text-primary hover:underline" onClick={() => setMode("up")}>Create account</button>
                    <button type="button" className="text-muted-foreground hover:underline" onClick={() => setMode("forgot")}>Forgot password?</button>
                  </>
                ) : (
                  <button type="button" className="text-primary hover:underline" onClick={() => setMode("in")}>Back to sign in</button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
