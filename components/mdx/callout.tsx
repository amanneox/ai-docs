"use client"

import { AlertTriangle, CheckCircle, Info, Lightbulb, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface CalloutProps {
  children: React.ReactNode
  type?: "info" | "warning" | "success" | "error" | "tip"
  title?: string
  className?: string
}

const calloutStyles = {
  info: {
    container: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800",
    icon: "text-blue-600 dark:text-blue-400",
    title: "text-blue-900 dark:text-blue-100",
    Icon: Info,
  },
  warning: {
    container: "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800",
    icon: "text-amber-600 dark:text-amber-400",
    title: "text-amber-900 dark:text-amber-100",
    Icon: AlertTriangle,
  },
  success: {
    container: "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800",
    icon: "text-green-600 dark:text-green-400",
    title: "text-green-900 dark:text-green-100",
    Icon: CheckCircle,
  },
  error: {
    container: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800",
    icon: "text-red-600 dark:text-red-400",
    title: "text-red-900 dark:text-red-100",
    Icon: XCircle,
  },
  tip: {
    container: "bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800",
    icon: "text-purple-600 dark:text-purple-400",
    title: "text-purple-900 dark:text-purple-100",
    Icon: Lightbulb,
  },
}

export function Callout({ 
  children, 
  type = "info", 
  title,
  className 
}: CalloutProps) {
  const styles = calloutStyles[type]
  const Icon = styles.Icon

  return (
    <div
      className={cn(
        "callout my-6 flex gap-4 rounded-lg border p-4",
        styles.container,
        className
      )}
    >
      <div className="flex-shrink-0">
        <Icon className={cn("h-5 w-5", styles.icon)} />
      </div>
      <div className="flex-1">
        {title && (
          <p className={cn("m-0 mb-2 font-semibold", styles.title)}>
            {title}
          </p>
        )}
        <div className="text-sm leading-relaxed text-foreground/90">
          {children}
        </div>
      </div>
    </div>
  )
}
