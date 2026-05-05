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
import type { ProjectItem } from "@/lib/projects"

interface CreateProjectDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: () => void
  name: string
  setName: (name: string) => void
  roomId: string
  isLoading: boolean
}

export function CreateProjectDialog({
  open,
  onClose,
  onSubmit,
  name,
  setName,
  roomId,
  isLoading,
}: CreateProjectDialogProps) {
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
            {roomId && (
              <>
                Room ID: <span className="font-mono">{roomId}</span>
              </>
            )}
          </p>
        </div>
        <DialogFooter showCloseButton>
          <Button disabled={!name.trim() || isLoading} onClick={onSubmit}>
            {isLoading ? "Creating…" : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface RenameProjectDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: () => void
  project: ProjectItem | null
  name: string
  setName: (name: string) => void
  isLoading: boolean
}

export function RenameProjectDialog({
  open,
  onClose,
  onSubmit,
  project,
  name,
  setName,
  isLoading,
}: RenameProjectDialogProps) {
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && name.trim() && !isLoading) {
      onSubmit()
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
          <Button disabled={!name.trim() || isLoading} onClick={onSubmit}>
            {isLoading ? "Renaming…" : "Rename"}
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
  project: ProjectItem | null
  isLoading: boolean
}

export function DeleteProjectDialog({
  open,
  onClose,
  onSubmit,
  project,
  isLoading,
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
          <Button variant="destructive" disabled={isLoading} onClick={onSubmit}>
            {isLoading ? "Deleting…" : "Delete Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
