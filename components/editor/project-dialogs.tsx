"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Project } from "@/lib/mock-projects"

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
}

interface CreateProjectDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (name: string) => void
  name: string
  setName: (name: string) => void
}

export function CreateProjectDialog({
  open,
  onClose,
  onSubmit,
  name,
  setName,
}: CreateProjectDialogProps) {
  const slug = toSlug(name)

  return (
    <Dialog open={open} onOpenChange={(next: boolean) => { if (!next) onClose() }}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
          <DialogDescription>
            Give your project a name to get started.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Input
            placeholder="Project name"
            value={name}
            onChange={(e) => setName((e.target as HTMLInputElement).value)}
            autoFocus
          />
          <p className="min-h-4 text-xs text-muted-foreground">
            {name && (
              <>
                Slug: <span className="font-mono">{slug || "—"}</span>
              </>
            )}
          </p>
        </div>
        <DialogFooter showCloseButton>
          <Button disabled={!name.trim()} onClick={() => onSubmit(name)}>
            Create Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface RenameProjectDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (name: string) => void
  project: Project | null
  name: string
  setName: (name: string) => void
}

export function RenameProjectDialog({
  open,
  onClose,
  onSubmit,
  project,
  name,
  setName,
}: RenameProjectDialogProps) {
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && name.trim()) {
      onSubmit(name)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next: boolean) => { if (!next) onClose() }}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>Rename Project</DialogTitle>
          {project && (
            <DialogDescription>
              Renaming &ldquo;{project.name}&rdquo;
            </DialogDescription>
          )}
        </DialogHeader>
        <Input
          placeholder="Project name"
          value={name}
          onChange={(e) => setName((e.target as HTMLInputElement).value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <DialogFooter showCloseButton>
          <Button disabled={!name.trim()} onClick={() => onSubmit(name)}>
            Rename
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface DeleteProjectDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: () => void
  project: Project | null
}

export function DeleteProjectDialog({
  open,
  onClose,
  onSubmit,
  project,
}: DeleteProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next: boolean) => { if (!next) onClose() }}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            {project ? <>&ldquo;{project.name}&rdquo;</> : "this project"}?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton>
          <Button variant="destructive" onClick={onSubmit}>
            Delete Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
