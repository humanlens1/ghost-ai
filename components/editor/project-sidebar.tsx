"use client"

import Link from "next/link"
import { Pencil, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { ProjectItem } from "@/lib/projects"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
  projects: ProjectItem[]
  activeProjectId?: string
  onCreateProject: () => void
  onRenameProject: (project: ProjectItem) => void
  onDeleteProject: (project: ProjectItem) => void
}

function ProjectListItem({
  project,
  isActive,
  onRename,
  onDelete,
}: {
  project: ProjectItem
  isActive?: boolean
  onRename: () => void
  onDelete: () => void
}) {
  return (
    <div
      className={cn(
        "group flex items-center gap-2 rounded-xl px-3 py-2.5 transition-colors",
        isActive
          ? "bg-brand/10 ring-1 ring-brand/25"
          : "hover:bg-elevated"
      )}
    >
      <Link
        href={`/editor/${project.id}`}
        className="min-w-0 flex-1"
        tabIndex={0}
      >
        <span
          className={cn(
            "block truncate text-sm font-medium",
            isActive ? "text-brand" : "text-copy-primary"
          )}
        >
          {project.name}
        </span>
      </Link>
      {project.owned && (
        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={(e) => { e.stopPropagation(); onRename() }}
            aria-label={`Rename ${project.name}`}
            className="text-copy-muted hover:text-foreground"
          >
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={(e) => { e.stopPropagation(); onDelete() }}
            aria-label={`Delete ${project.name}`}
            className="text-copy-muted hover:text-state-error"
          >
            <Trash2 />
          </Button>
        </div>
      )}
    </div>
  )
}

export function ProjectSidebar({
  isOpen,
  onClose,
  projects,
  activeProjectId,
  onCreateProject,
  onRenameProject,
  onDeleteProject,
}: ProjectSidebarProps) {
  const myProjects = projects.filter((p: ProjectItem) => p.owned)
  const sharedProjects = projects.filter((p: ProjectItem) => !p.owned)

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-12 z-40 flex h-[calc(100vh-3rem)] w-72 flex-col",
          "bg-elevated border-r border-border",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
          <span className="text-sm font-semibold text-foreground tracking-wide">Projects</span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close sidebar"
            className="text-copy-muted hover:text-foreground"
          >
            <X />
          </Button>
        </div>

        {/* Project lists */}
        <div className="flex flex-1 flex-col overflow-hidden p-3">
          <Tabs defaultValue="my-projects" className="flex flex-1 flex-col gap-3">
            <TabsList className="w-full">
              <TabsTrigger value="my-projects" className="flex-1 text-xs font-medium">
                My Projects
              </TabsTrigger>
              <TabsTrigger value="shared" className="flex-1 text-xs font-medium">
                Shared
              </TabsTrigger>
            </TabsList>

            <TabsContent value="my-projects" className="flex-1 overflow-y-auto">
              {myProjects.length === 0 ? (
                <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border">
                  <p className="text-xs text-copy-muted">No projects yet</p>
                  <button
                    onClick={onCreateProject}
                    className="text-xs text-brand underline-offset-4 hover:underline"
                  >
                    Create one
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-0.5">
                  {myProjects.map((project) => (
                    <ProjectListItem
                      key={project.id}
                      project={project}
                      isActive={project.id === activeProjectId}
                      onRename={() => onRenameProject(project)}
                      onDelete={() => onDeleteProject(project)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="shared" className="flex-1 overflow-y-auto">
              {sharedProjects.length === 0 ? (
                <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border">
                  <p className="text-xs text-copy-muted">No shared projects</p>
                </div>
              ) : (
                <div className="flex flex-col gap-0.5">
                  {sharedProjects.map((project) => (
                    <ProjectListItem
                      key={project.id}
                      project={project}
                      isActive={project.id === activeProjectId}
                      onRename={() => onRenameProject(project)}
                      onDelete={() => onDeleteProject(project)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-border p-3">
          <Button
            variant="default"
            className="w-full"
            onClick={onCreateProject}
          >
            New Project
          </Button>
        </div>
      </aside>
    </>
  )
}
