"use client"

import { useState } from "react"

import { useProjectDialogs } from "@/hooks/use-project-dialogs"
import { EditorNavbar } from "./editor-navbar"
import { ProjectSidebar } from "./project-sidebar"
import { ProjectDialogsContext } from "./project-dialogs-context"
import {
  CreateProjectDialog,
  RenameProjectDialog,
  DeleteProjectDialog,
} from "./project-dialogs"

export function EditorShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const dialogs = useProjectDialogs()

  return (
    <ProjectDialogsContext.Provider
      value={{
        openCreate: dialogs.openCreate,
        openRename: dialogs.openRename,
        openDelete: dialogs.openDelete,
      }}
    >
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={() => setIsSidebarOpen((prev) => !prev)}
      />
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        projects={dialogs.projects}
        onCreateProject={dialogs.openCreate}
        onRenameProject={dialogs.openRename}
        onDeleteProject={dialogs.openDelete}
      />
      <main className="pt-12">{children}</main>

      <CreateProjectDialog
        open={dialogs.dialog === "create"}
        onClose={dialogs.closeDialog}
        onSubmit={dialogs.submitCreate}
        name={dialogs.name}
        setName={dialogs.setName}
      />
      <RenameProjectDialog
        open={dialogs.dialog === "rename"}
        onClose={dialogs.closeDialog}
        onSubmit={dialogs.submitRename}
        project={dialogs.selectedProject}
        name={dialogs.name}
        setName={dialogs.setName}
      />
      <DeleteProjectDialog
        open={dialogs.dialog === "delete"}
        onClose={dialogs.closeDialog}
        onSubmit={dialogs.submitDelete}
        project={dialogs.selectedProject}
      />
    </ProjectDialogsContext.Provider>
  )
}
