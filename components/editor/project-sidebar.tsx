"use client"

import { Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-12 z-40 flex h-[calc(100vh-3rem)] w-72 flex-col",
        "bg-surface border-r border-border",
        "transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
        <span className="text-sm font-semibold text-foreground">Projects</span>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X />
        </Button>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden p-3">
        <Tabs defaultValue="my-projects" className="flex flex-1 flex-col">
          <TabsList className="w-full">
            <TabsTrigger value="my-projects" className="flex-1">
              My Projects
            </TabsTrigger>
            <TabsTrigger value="shared" className="flex-1">
              Shared
            </TabsTrigger>
          </TabsList>
          <TabsContent value="my-projects" className="flex-1">
            <div className="flex h-full items-center justify-center py-8">
              <p className="text-sm text-muted-foreground">No projects yet</p>
            </div>
          </TabsContent>
          <TabsContent value="shared" className="flex-1">
            <div className="flex h-full items-center justify-center py-8">
              <p className="text-sm text-muted-foreground">No shared projects</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="shrink-0 border-t border-border p-3">
        <Button variant="outline" className="w-full">
          <Plus />
          New Project
        </Button>
      </div>
    </aside>
  )
}
