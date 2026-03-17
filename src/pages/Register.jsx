import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { DEPARTMENTS } from "@/config/constants";
import { useAuthStore } from "@/store/authStore";

export default function Register() {
  const navigate = useNavigate();
  const { signUp, loading } = useAuthStore();
  const [form, setForm] = useState({
    fullName: "",
    rollNumber: "",
    email: "",
    password: "",
    department: "CSE",
    branch: "Core CSE"
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-hero-radial bg-slate-100 px-4 dark:bg-slate-950">
      <Card className="w-full max-w-xl space-y-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Register</h1>
          <p className="text-sm text-slate-500">Student profile is created immediately. No manual approval is required.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input placeholder="Full name" value={form.fullName} onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))} />
          <Input placeholder="Roll number" value={form.rollNumber} onChange={(event) => setForm((current) => ({ ...current, rollNumber: event.target.value }))} />
          <Input placeholder="Email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
          <Input type="password" placeholder="Password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} />
          <Select value={form.department} onChange={(event) => setForm((current) => ({ ...current, department: event.target.value }))}>
            {DEPARTMENTS.slice(0, 4).map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </Select>
          <Input placeholder="Branch" value={form.branch} onChange={(event) => setForm((current) => ({ ...current, branch: event.target.value }))} />
        </div>
        <Button
          className="w-full"
          disabled={loading}
          onClick={async () => {
            try {
              const next = await signUp(form);
              toast.success("Account created.");
              navigate(next);
            } catch (error) {
              toast.error(error.message);
            }
          }}
        >
          Create Account
        </Button>
      </Card>
    </div>
  );
}
