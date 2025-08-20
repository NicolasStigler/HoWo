'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full bg-background shadow-[inset_2px_2px_4px_#dedcff,inset_-2px_-2px_4px_#ffffff] dark:shadow-[inset_2px_2px_4px_#1a1a1a,inset_-2px_-2px_4px_#2a2a2a] text-muted-foreground hover:text-primary-foreground/90 hover:bg-background active:shadow-[2px_2px_4px_#dedcff,-2px_-2px_4px_#ffffff] dark:active:shadow-[2px_2px_4px_#1a1a1a,-2px_-2px_4px_#2a2a2a] transition-all"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Cambiar colores</span>
    </Button>
  )
}
