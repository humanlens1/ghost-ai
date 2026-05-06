"use client"

import { UserButton } from "@clerk/nextjs"
import { Ghost, LayoutTemplate, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface WorkspaceNavbarProps {
  projectName: string
  isSidebarOpen: boolean
  onSidebarToggle: () => void
  isAiPanelOpen: boolean
  onAiPanelToggle: () => void
  isOwner: boolean
  onShareOpen: () => void
  onTemplatesOpen: () => void
  className?: string
}

export function WorkspaceNavbar({
  projectName,
  isSidebarOpen,
  onSidebarToggle,
  isAiPanelOpen,
  onAiPanelToggle,
  isOwner,
  onShareOpen,
  onTemplatesOpen,
  className,
}: WorkspaceNavbarProps) {
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex h-12 items-center gap-2",
        "bg-surface border-b border-border px-2",
        className
      )}
    >
      {/* Left: sidebar toggle + wordmark */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onSidebarToggle}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          className="text-copy-muted hover:text-foreground"
        >
          {isSidebarOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
        </Button>
        <div className="flex items-center gap-1.5">
          <Ghost className="h-4 w-4 text-brand" aria-hidden="true" />
          <span className="hidden text-sm font-semibold tracking-tight text-foreground sm:block">
            Ghost<span className="text-brand">AI</span>
          </span>
        </div>
      </div>

      {/* Center: project name */}
      <div className="flex flex-1 items-center justify-center">
        <div className="flex items-center gap-2 rounded-lg bg-elevated px-3 py-1 ring-1 ring-border">
          <span className="max-w-48 truncate text-sm font-medium text-foreground">
            {projectName}
          </span>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          onClick={onTemplatesOpen}
          aria-label="Starter templates"
          className="text-copy-muted hover:text-foreground"
          title="Starter templates"
        >
          <LayoutTemplate className="h-4 w-4" />
        </Button>
        {isOwner && (
          <Button
            size="sm"
            variant="default"
            onClick={onShareOpen}
            aria-label="Share project"
            className="gap-1.5"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onAiPanelToggle}
          aria-label={isAiPanelOpen ? "Close AI panel" : "Open AI panel"}
          className="text-copy-muted hover:text-foreground"
        >
          {isAiPanelOpen ? <PanelRightClose /> : <PanelRightOpen />}
        </Button>
        <UserButton />
      </div>
    </header>
  )
}
