"use client"

import { useState } from "react"

import { useProjectActions } from "@/hooks/use-project-actions"
import type { ProjectItem } from "@/lib/projects"
import { WorkspaceNavbar } from "./workspace-navbar"
import { ProjectSidebar } from "./project-sidebar"
import { ProjectDialogsContext } from "./project-dialogs-context"
import {
  CreateProjectDialog,
  RenameProjectDialog,
  DeleteProjectDialog,
} from "./project-dialogs"
import { ShareDialog } from "./share-dialog"

interface WorkspaceShellProps {
  project: { id: string; name: string }
  projects: ProjectItem[]
  activeProjectId: string
  isOwner: boolean
}

export function WorkspaceShell({ project, projects, activeProjectId, isOwner }: WorkspaceShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const actions = useProjectActions()

  return (
    <ProjectDialogsContext.Provider
      value={{
        openCreate: actions.openCreate,
        openRename: actions.openRename,
        openDelete: actions.openDelete,
      }}
    >
      <WorkspaceNavbar
        projectName={project.name}
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={() => setIsSidebarOpen((prev) => !prev)}
        isAiPanelOpen={isAiPanelOpen}
        onAiPanelToggle={() => setIsAiPanelOpen((prev) => !prev)}
        isOwner={isOwner}
        onShareOpen={() => setIsShareOpen(true)}
      />

      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        projects={projects}
        activeProjectId={activeProjectId}
        onCreateProject={actions.openCreate}
        onRenameProject={actions.openRename}
        onDeleteProject={actions.openDelete}
      />

      <div className="flex h-screen pt-12">
        {/* Canvas area */}
        <main className="flex flex-1 items-center justify-center bg-base">
          <p className="text-sm text-copy-muted">Canvas coming soon</p>
        </main>

        {/* AI sidebar placeholder */}
        {isAiPanelOpen && (
          <aside className="flex w-80 shrink-0 flex-col border-l border-border bg-elevated">
            <div className="flex h-12 items-center justify-between border-b border-border px-4">
              <span className="text-sm font-semibold text-foreground">AI Assistant</span>
            </div>
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-copy-muted">AI chat coming soon</p>
            </div>
          </aside>
        )}
      </div>

      <CreateProjectDialog
        open={actions.dialog === "create"}
        onClose={actions.closeDialog}
        onSubmit={actions.submitCreate}
        name={actions.name}
        setName={actions.setName}
        roomId={actions.roomId}
        isLoading={actions.isLoading}
      />
      <RenameProjectDialog
        open={actions.dialog === "rename"}
        onClose={actions.closeDialog}
        onSubmit={actions.submitRename}
        project={actions.selectedProject}
        name={actions.name}
        setName={actions.setName}
        isLoading={actions.isLoading}
      />
      <DeleteProjectDialog
        open={actions.dialog === "delete"}
        onClose={actions.closeDialog}
        onSubmit={actions.submitDelete}
        project={actions.selectedProject}
        isLoading={actions.isLoading}
      />
      <ShareDialog
        open={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        projectId={project.id}
        isOwner={isOwner}
      />
    </ProjectDialogsContext.Provider>
  )
}
