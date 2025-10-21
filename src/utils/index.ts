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
