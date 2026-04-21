"use client"

import { useTheme } from "next-themes"
import { useEffect } from "react"

export function Toaster() {
  const { theme } = useTheme()
  
  return (
    <div 
      className="fixed bottom-4 right-4 z-50"
      suppressHydrationWarning
    />
  )
}