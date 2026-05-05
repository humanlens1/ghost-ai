"use client"

import { useState } from "react"

import { mockProjects, type Project } from "@/lib/mock-projects"

type DialogType = "none" | "create" | "rename" | "delete"

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
}

export function useProjectDialogs() {
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [dialog, setDialog] = useState<DialogType>("none")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [name, setName] = useState("")
  const [isLoading] = useState(false)

  function openCreate() {
    setName("")
    setSelectedProject(null)
    setDialog("create")
  }

  function openRename(project: Project) {
    setName(project.name)
    setSelectedProject(project)
    setDialog("rename")
  }

  function openDelete(project: Project) {
    setSelectedProject(project)
    setDialog("delete")
  }

  function closeDialog() {
    setDialog("none")
    setSelectedProject(null)
    setName("")
  }

  function submitCreate(projectName: string) {
    const newProject: Project = {
      id: Date.now().toString(),
      name: projectName,
      slug: toSlug(projectName),
      owned: true,
    }
    setProjects((prev) => [...prev, newProject])
    closeDialog()
  }

  function submitRename(projectName: string) {
    if (!selectedProject) return
    setProjects((prev) =>
      prev.map((p) =>
        p.id === selectedProject.id
          ? { ...p, name: projectName, slug: toSlug(projectName) }
          : p
      )
    )
    closeDialog()
  }

  function submitDelete() {
    if (!selectedProject) return
    setProjects((prev) => prev.filter((p) => p.id !== selectedProject.id))
    closeDialog()
  }

  return {
    projects,
    dialog,
    selectedProject,
    name,
    setName,
    isLoading,
    openCreate,
    openRename,
    openDelete,
    closeDialog,
    submitCreate,
    submitRename,
    submitDelete,
  }
}
