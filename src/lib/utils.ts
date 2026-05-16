import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export function getHealthScoreColor(score: number): string {
  if (score >= 85) return "text-green-600";
  if (score >= 70) return "text-blue-600";
  if (score >= 50) return "text-yellow-600";
  return "text-red-600";
}

export function getHealthScoreBg(score: number): string {
  if (score >= 85) return "bg-green-50 border-green-200";
  if (score >= 70) return "bg-blue-50 border-blue-200";
  if (score >= 50) return "bg-yellow-50 border-yellow-200";
  return "bg-red-50 border-red-200";
}

export function getStatusColor(
  status: "normal" | "abnormal" | "borderline" | "critical" | "low" | "high"
): string {
  switch (status) {
    case "normal":
      return "text-green-700 bg-green-50 border-green-200";
    case "borderline":
    case "low":
      return "text-yellow-700 bg-yellow-50 border-yellow-200";
    case "abnormal":
    case "high":
      return "text-orange-700 bg-orange-50 border-orange-200";
    case "critical":
      return "text-red-700 bg-red-50 border-red-200";
    default:
      return "text-gray-700 bg-gray-50 border-gray-200";
  }
}

export function petAgeLabel(age: number, species: string): string {
  const dogYears: Record<number, string> = {
    1: "~7 human years",
    2: "~14 human years",
    3: "~28 human years",
    5: "~36 human years",
    7: "~44 human years",
    10: "~56 human years",
  };

  if (species === "dog") {
    const closest = Object.keys(dogYears)
      .map(Number)
      .reduce((a, b) => (Math.abs(b - age) < Math.abs(a - age) ? b : a));
    return dogYears[closest] ?? "";
  }
  return "";
}
