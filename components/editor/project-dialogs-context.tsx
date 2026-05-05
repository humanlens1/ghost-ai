"use client"

import { createContext, useContext } from "react"

import type { Project } from "@/lib/mock-projects"

interface ProjectDialogsContextValue {
  openCreate: () => void
  openRename: (project: Project) => void
  openDelete: (project: Project) => void
}

export const ProjectDialogsContext =
  createContext<ProjectDialogsContextValue | null>(null)

export function useProjectDialogsContext() {
  const ctx = useContext(ProjectDialogsContext)
  if (!ctx) throw new Error("Must be used within EditorShell")
  return ctx
}
