"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "light" } = useTheme()

  return (
    <Sonner
  theme="dark"
  className="toaster group
    [&>li]:bg-zinc-900
    [&>li]:border
    [&>li]:border-zinc-700
    [&>li]:shadow-[0_10px_40px_rgba(0,0,0,0.9)]
    [&>li]:ring-1
    [&>li]:ring-zinc-600/40
  "
  icons={{
    success: <CircleCheckIcon className="size-4 text-emerald-400" />,
    info: <InfoIcon className="size-4 text-sky-400" />,
    warning: <TriangleAlertIcon className="size-4 text-amber-400" />,
    error: <OctagonXIcon className="size-4 text-rose-400" />,
    loading: <Loader2Icon className="size-4 animate-spin text-zinc-300" />,
  }}
  style={
    {
      "--normal-bg": "#18181d",     // zinc-9
      "--normal-text": "#fafafa",   // zinc-50 (clear)
      "--normal-border": "#3f3f46", // zinc-700
      "--border-radius": "12px",
    } as React.CSSProperties
  }
/>

  )
}

export { Toaster }
