import { useEffect, useState } from "react";

export default function Timer({ seconds = 1200, running = true }) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (!running) return undefined;
    const interval = setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(interval);
  }, [running]);

  const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
  const secs = String(remaining % 60).padStart(2, "0");
  return <span>{minutes}:{secs}</span>;
}
