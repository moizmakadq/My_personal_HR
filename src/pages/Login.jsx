import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { DEMO_ACCOUNTS } from "@/config/constants";
import { useAuthStore } from "@/store/authStore";

export default function Login() {
  const navigate = useNavigate();
  const { signIn, loading } = useAuthStore();
  const [form, setForm] = useState({ email: DEMO_ACCOUNTS.admin.email, password: DEMO_ACCOUNTS.admin.password });

  return (
    <div className="flex min-h-screen items-center justify-center bg-hero-radial bg-slate-100 px-4 dark:bg-slate-950">
      <Card className="w-full max-w-lg space-y-5">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Login</h1>
          <p className="text-sm text-slate-500">Use the demo accounts or your own Supabase credentials.</p>
        </div>
        <Input
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          placeholder="Email"
        />
        <Input
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          placeholder="Password"
        />
        <Button
          className="w-full"
          disabled={loading}
          onClick={async () => {
            try {
              const next = await signIn(form);
              toast.success("Welcome back.");
              navigate(next);
            } catch (error) {
              toast.error(error.message);
            }
          }}
        >
          Login
        </Button>
        <div className="rounded-3xl bg-slate-100 p-4 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">
          <p>Demo accounts:</p>
          <p>{DEMO_ACCOUNTS.admin.email} / {DEMO_ACCOUNTS.admin.password}</p>
          <p>{DEMO_ACCOUNTS.student.email} / {DEMO_ACCOUNTS.student.password}</p>
          <p>{DEMO_ACCOUNTS.interviewer.email} / {DEMO_ACCOUNTS.interviewer.password}</p>
        </div>
        <p className="text-sm text-slate-500">
          New here? <Link to="/register" className="text-brand-600">Create an account</Link>
        </p>
      </Card>
    </div>
  );
}
