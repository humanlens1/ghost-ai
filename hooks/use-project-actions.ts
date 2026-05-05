"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { toSlug, type ProjectItem } from "@/lib/projects"

type DialogType = "none" | "create" | "rename" | "delete"

function shortSuffix(): string {
  return Math.random().toString(36).slice(2, 8)
}

export function useProjectActions() {
  const router = useRouter()
  const params = useParams()

  const [dialog, setDialog] = useState<DialogType>("none")
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null)
  const [name, setName] = useState("")
  const [createSuffix, setCreateSuffix] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const slug = toSlug(name)
  const roomId = name ? `${slug || "project"}-${createSuffix}` : ""

  function openCreate() {
    setName("")
    setCreateSuffix(shortSuffix())
    setSelectedProject(null)
    setDialog("create")
  }

  function openRename(project: ProjectItem) {
    setName(project.name)
    setSelectedProject(project)
    setDialog("rename")
  }

  function openDelete(project: ProjectItem) {
    setSelectedProject(project)
    setDialog("delete")
  }

  function closeDialog() {
    setDialog("none")
    setSelectedProject(null)
    setName("")
    setCreateSuffix("")
  }

  async function submitCreate() {
    if (!name.trim()) return
    const id = roomId || `project-${shortSuffix()}`
    setIsLoading(true)
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name: name.trim() }),
      })
      if (!res.ok) throw new Error("Failed to create project")
      closeDialog()
      router.push(`/editor/${id}`)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  async function submitRename() {
    if (!selectedProject || !name.trim()) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      })
      if (!res.ok) throw new Error("Failed to rename project")
      closeDialog()
      router.refresh()
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  async function submitDelete() {
    if (!selectedProject) return
    const rawId = params?.id
    const activeId = Array.isArray(rawId) ? rawId[0] : rawId
    setIsLoading(true)
    try {
      const res = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete project")
      closeDialog()
      if (activeId === selectedProject.id) {
        router.push("/editor")
      } else {
        router.refresh()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    dialog,
    selectedProject,
    name,
    setName,
    roomId,
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
