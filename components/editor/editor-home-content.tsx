"use client"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useProjectDialogsContext } from "@/components/editor/project-dialogs-context"

export function EditorHomeContent() {
  const { openCreate } = useProjectDialogsContext()
  return (
    <Button onClick={openCreate}>
      <Plus />
      New Project
    </Button>
  )
}
