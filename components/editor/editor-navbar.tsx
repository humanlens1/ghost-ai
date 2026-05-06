"use client"

import { UserButton } from "@clerk/nextjs"
import { Ghost, PanelLeftClose, PanelLeftOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EditorNavbarProps {
  isSidebarOpen: boolean
  onSidebarToggle: () => void
  className?: string
}

export function EditorNavbar({
  isSidebarOpen,
  onSidebarToggle,
  className,
}: EditorNavbarProps) {
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex h-12 items-center",
        "bg-surface border-b border-border",
        className
      )}
    >
      <div className="flex items-center px-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onSidebarToggle}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          className="text-copy-muted hover:text-foreground"
        >
          {isSidebarOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
        </Button>
      </div>

      <div className="flex flex-1 items-center justify-center gap-2">
        <Ghost className="h-4 w-4 text-brand" aria-hidden="true" />
        <span className="text-sm font-semibold tracking-tight text-foreground">
          Ghost<span className="text-brand">AI</span>
        </span>
      </div>

      <div className="flex items-center px-3">
        <UserButton />
      </div>
    </header>
  )
}
