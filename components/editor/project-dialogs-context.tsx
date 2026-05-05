"use client"

import { createContext, useContext } from "react"

import type { ProjectItem } from "@/lib/projects"

interface ProjectDialogsContextValue {
  openCreate: () => void
  openRename: (project: ProjectItem) => void
  openDelete: (project: ProjectItem) => void
}

export const ProjectDialogsContext =
  createContext<ProjectDialogsContextValue | null>(null)

export function useProjectDialogsContext() {
  const ctx = useContext(ProjectDialogsContext)
  if (!ctx) throw new Error("Must be used within EditorShell")
  return ctx
}
