import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-100 px-4 text-center dark:bg-slate-950">
      <h1 className="font-display text-5xl font-bold text-slate-900 dark:text-white">404</h1>
      <p className="text-slate-500">The page you requested does not exist.</p>
      <Link to="/">
        <Button>Go Home</Button>
      </Link>
    </div>
  );
}
