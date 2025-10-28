import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPriorityColor(priority: string) {
  switch (priority) {
    case "high":
      return "bg-primary/10 text-primary border-primary/20"
    case "medium":
      return "bg-secondary/10 text-secondary border-secondary/20"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

export function getCookie(name: string) {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
}

export function setCookie(name: string, value: string, days = 7) {
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Strict; ${
        location.protocol === "https:" ? "Secure;" : ""
    }`;
};