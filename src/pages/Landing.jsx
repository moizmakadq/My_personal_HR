import { motion } from "framer-motion";
import { ArrowRight, Brain, ChartScatter, ShieldCheck, Sparkles, Target, TimerReset } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { APP_NAME, APP_TAGLINE } from "@/config/constants";

const features = [
  { icon: ShieldCheck, title: "Resume Trust Score", text: "Every resume gets a trust score based on internal consistency. No more fake claims." },
  { icon: Brain, title: "Drive Autopilot", text: "Paste a JD. Get a complete placement drive in seconds with shortlist and schedule." },
  { icon: Target, title: "Plagiarism Detection", text: "Detect copied resumes, cloned skill sets, and duplicate projects across the batch." },
  { icon: Sparkles, title: "Diamond Finder", text: "Find hidden gems who outperform their pre-screen score during interviews." },
  { icon: TimerReset, title: "Bias Detection", text: "Catch fatigue, scoring drift, and panel variance before decisions get distorted." },
  { icon: ChartScatter, title: "Placement Probability", text: "Show students their likely outcomes before they apply, grounded in real competition." }
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-hero-radial bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-7xl space-y-16">
        <header className="flex items-center justify-between rounded-[32px] border border-white/10 bg-white/5 px-6 py-4 backdrop-blur">
          <div>
            <div className="font-display text-2xl font-bold">{APP_NAME}</div>
            <div className="text-sm text-slate-300">{APP_TAGLINE}</div>
          </div>
          <div className="flex gap-3">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </header>

        <section className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <p className="inline-flex rounded-full bg-brand-500/15 px-4 py-2 text-sm font-semibold text-brand-200">
              Smart Campus Placements
            </p>
            <h1 className="font-display text-5xl font-bold leading-tight md:text-6xl">
              Smart campus placements with trust, proof, and zero dump interviews.
            </h1>
            <p className="max-w-2xl text-lg text-slate-300">
              AI-powered resume analysis, fraud detection, interviewer intelligence, and free deployment on Netlify.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/register">
                <Button size="lg">
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="secondary">
                  Login
                </Button>
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="bg-white/10 text-white">
                <p className="font-display text-3xl font-bold">70%</p>
                <p className="text-sm text-slate-300">Dump interviews eliminated</p>
              </Card>
              <Card className="bg-white/10 text-white">
                <p className="font-display text-3xl font-bold">4 sec</p>
                <p className="text-sm text-slate-300">Drive setup with Autopilot</p>
              </Card>
              <Card className="bg-white/10 text-white">
                <p className="font-display text-3xl font-bold">95%</p>
                <p className="text-sm text-slate-300">Resume fraud signals surfaced</p>
              </Card>
            </div>
          </motion.div>

          <Card className="space-y-5 bg-white/10 text-white">
            <div className="rounded-[28px] bg-slate-950/50 p-5">
              <p className="text-sm text-slate-300">How it works</p>
              <ol className="mt-4 space-y-4 text-sm text-slate-200">
                <li>1. Students upload resumes and videos. PlaceRight auto-builds a read-only profile.</li>
                <li>2. Admin pastes a JD. PlaceRight parses, scores, and shortlists in one flow.</li>
                <li>3. Interviewers get trust-aware prompts so only the right candidates reach the room.</li>
              </ol>
            </div>
            <div className="grid gap-3">
              {features.slice(0, 3).map((feature) => (
                <div key={feature.title} className="rounded-3xl border border-white/10 p-4">
                  <p className="font-semibold">{feature.title}</p>
                  <p className="mt-1 text-sm text-slate-300">{feature.text}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="bg-white/10 text-white">
              <feature.icon className="h-8 w-8 text-brand-300" />
              <h3 className="mt-4 font-display text-xl font-bold">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{feature.text}</p>
            </Card>
          ))}
        </section>

        <footer className="border-t border-white/10 pt-8 text-center text-sm text-slate-400">
          Built for campus placements. Free forever.
        </footer>
      </div>
    </div>
  );
}
