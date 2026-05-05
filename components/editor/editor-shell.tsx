"use client"

import { useState } from "react"

import { useProjectActions } from "@/hooks/use-project-actions"
import type { ProjectItem } from "@/lib/projects"
import { EditorNavbar } from "./editor-navbar"
import { ProjectSidebar } from "./project-sidebar"
import { ProjectDialogsContext } from "./project-dialogs-context"
import {
  CreateProjectDialog,
  RenameProjectDialog,
  DeleteProjectDialog,
} from "./project-dialogs"

interface EditorShellProps {
  children: React.ReactNode
  ownedProjects: ProjectItem[]
  sharedProjects: ProjectItem[]
}

export function EditorShell({ children, ownedProjects, sharedProjects }: EditorShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const actions = useProjectActions()
  const allProjects = [...ownedProjects, ...sharedProjects]

  return (
    <ProjectDialogsContext.Provider
      value={{
        openCreate: actions.openCreate,
        openRename: actions.openRename,
        openDelete: actions.openDelete,
      }}
    >
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={() => setIsSidebarOpen((prev) => !prev)}
      />
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        projects={allProjects}
        onCreateProject={actions.openCreate}
        onRenameProject={actions.openRename}
        onDeleteProject={actions.openDelete}
      />
      <main className="pt-12">{children}</main>

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
    </ProjectDialogsContext.Provider>
  )
}
