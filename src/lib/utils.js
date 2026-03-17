import { format, formatDistanceToNowStrict, isValid, parseISO } from "date-fns";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs) => twMerge(clsx(inputs));

export const uid = (prefix = "id") =>
  `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;

export const clamp = (value, min = 0, max = 100) => Math.min(Math.max(value, min), max);

export const round = (value, digits = 2) => {
  const factor = 10 ** digits;
  return Math.round((Number(value) + Number.EPSILON) * factor) / factor;
};

export const average = (values = []) => {
  const valid = values.filter((value) => Number.isFinite(Number(value))).map(Number);
  if (!valid.length) return 0;
  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
};

export const median = (values = []) => {
  const sorted = values
    .filter((value) => Number.isFinite(Number(value)))
    .map(Number)
    .sort((a, b) => a - b);
  if (!sorted.length) return 0;
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

export const titleCase = (value = "") =>
  value
    .toLowerCase()
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

export const slugify = (value = "") =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const sentenceCase = (value = "") =>
  value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : "";

export const escapeRegex = (value = "") => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const formatDate = (value, pattern = "dd MMM yyyy") => {
  if (!value) return "N/A";
  const parsed = typeof value === "string" ? parseISO(value) : value;
  if (!isValid(parsed)) return value;
  return format(parsed, pattern);
};

export const relativeDate = (value) => {
  if (!value) return "N/A";
  const parsed = typeof value === "string" ? parseISO(value) : value;
  if (!isValid(parsed)) return value;
  return formatDistanceToNowStrict(parsed, { addSuffix: true });
};

export const formatCurrency = (value, currency = "INR") => {
  if (!Number.isFinite(Number(value))) return "N/A";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 1
  }).format(Number(value));
};

export const formatPercent = (value, digits = 0) => `${round(value, digits)}%`;

export const percentage = (value, total) => {
  if (!total) return 0;
  return (Number(value) / Number(total)) * 100;
};

export const groupBy = (items = [], getKey) =>
  items.reduce((groups, item) => {
    const key = getKey(item);
    groups[key] = groups[key] || [];
    groups[key].push(item);
    return groups;
  }, {});

export const sortBy = (items = [], getValue, direction = "desc") => {
  const factor = direction === "asc" ? 1 : -1;
  return [...items].sort((a, b) => {
    const left = getValue(a);
    const right = getValue(b);
    if (left < right) return -1 * factor;
    if (left > right) return 1 * factor;
    return 0;
  });
};

export const unique = (items = []) => Array.from(new Set(items.filter(Boolean)));

export const tokenize = (text = "") =>
  unique(
    text
      .toLowerCase()
      .replace(/[^a-z0-9+#.\s]/g, " ")
      .split(/\s+/)
      .filter((token) => token.length > 2)
  );

export const jaccardSimilarity = (left, right) => {
  const leftTokens = Array.isArray(left) ? unique(left.map(String)) : tokenize(String(left));
  const rightTokens = Array.isArray(right) ? unique(right.map(String)) : tokenize(String(right));
  const union = new Set([...leftTokens, ...rightTokens]);
  if (!union.size) return 0;
  let intersection = 0;
  union.forEach((token) => {
    if (leftTokens.includes(token) && rightTokens.includes(token)) {
      intersection += 1;
    }
  });
  return intersection / union.size;
};

export const keywordMatchScore = (source = [], target = []) => {
  if (!target.length) return 100;
  const normalizedSource = source.map((item) => String(item).toLowerCase());
  const hits = target.filter((skill) => normalizedSource.includes(String(skill).toLowerCase())).length;
  return round((hits / target.length) * 100);
};

export const safeJsonParse = (value, fallback = null) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

export const initials = (name = "User") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment[0]?.toUpperCase())
    .join("");

export const barClass = (value) => {
  if (value >= 80) return "bg-emerald-500";
  if (value >= 60) return "bg-amber-500";
  return "bg-rose-500";
};

export const scoreTone = (value) => {
  if (value >= 80) return "excellent";
  if (value >= 65) return "good";
  if (value >= 45) return "watch";
  return "risky";
};
