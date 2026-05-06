"use client"

import { useState, useEffect, useCallback } from "react"
import { Copy, Check, X, UserPlus, Users } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Collaborator {
  email: string
  name: string | null
  avatarUrl: string | null
}

interface ShareDialogProps {
  open: boolean
  onClose: () => void
  projectId: string
  isOwner: boolean
}

export function ShareDialog({ open, onClose, projectId, isOwner }: ShareDialogProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [isInviting, setIsInviting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCollaborators = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`)
      if (!res.ok) return
      const data = await res.json()
      setCollaborators(data.collaborators)
    } finally {
      setIsLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    if (open) fetchCollaborators()
  }, [open, fetchCollaborators])

  async function handleInvite() {
    const email = inviteEmail.trim()
    if (!email) return
    setIsInviting(true)
    setError(null)
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError((data as { error?: string }).error ?? "Failed to invite")
        return
      }
      setInviteEmail("")
      await fetchCollaborators()
    } finally {
      setIsInviting(false)
    }
  }

  async function handleRemove(email: string) {
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators/${encodeURIComponent(email)}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError((data as { error?: string }).error ?? "Failed to remove collaborator")
        return
      }
      await fetchCollaborators()
    } catch (err) {
      setError("Failed to remove collaborator")
    }
  }

  async function handleCopyLink() {
    const url = `${window.location.origin}/editor/${projectId}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={(next: boolean) => { if (!next) onClose() }}>
      <DialogContent showCloseButton className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Project</DialogTitle>
        </DialogHeader>

        {/* Invite form — owners only */}
        {isOwner && (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-copy-muted uppercase tracking-wide">
              Invite collaborator
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="Email address"
                type="email"
                value={inviteEmail}
                onChange={(e) => {
                  setInviteEmail((e.target as HTMLInputElement).value)
                  setError(null)
                }}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === "Enter" && !isInviting) handleInvite()
                }}
                disabled={isInviting}
              />
              <Button
                onClick={handleInvite}
                disabled={!inviteEmail.trim() || isInviting}
                size="default"
                className="shrink-0"
              >
                <UserPlus className="h-3.5 w-3.5" />
                {isInviting ? "Inviting…" : "Invite"}
              </Button>
            </div>
            {error && (
              <p className="rounded-lg bg-state-error/10 px-3 py-2 text-xs text-state-error">
                {error}
              </p>
            )}
          </div>
        )}

        {/* Collaborator list */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 pb-1">
            <Users className="h-3.5 w-3.5 text-copy-muted" />
            <span className="text-xs font-medium text-copy-muted uppercase tracking-wide">
              {collaborators.length > 0 ? `${collaborators.length} collaborator${collaborators.length !== 1 ? "s" : ""}` : "Collaborators"}
            </span>
          </div>

          {isLoading ? (
            <div className="flex h-16 items-center justify-center">
              <p className="text-sm text-copy-muted">Loading…</p>
            </div>
          ) : collaborators.length === 0 ? (
            <div className="flex h-16 items-center justify-center rounded-xl border border-dashed border-border">
              <p className="text-sm text-copy-muted">No collaborators yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-0.5 rounded-xl bg-surface/60 p-1 ring-1 ring-border">
              {collaborators.map((collab) => (
                <div
                  key={collab.email}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-elevated transition-colors"
                >
                  <CollabAvatar name={collab.name} avatarUrl={collab.avatarUrl} email={collab.email} />
                  <div className="min-w-0 flex-1">
                    {collab.name ? (
                      <>
                        <p className="truncate text-sm font-medium text-foreground leading-tight">{collab.name}</p>
                        <p className="truncate text-xs text-copy-muted">{collab.email}</p>
                      </>
                    ) : (
                      <p className="truncate text-sm text-foreground">{collab.email}</p>
                    )}
                  </div>
                  {isOwner && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleRemove(collab.email)}
                      aria-label={`Remove ${collab.email}`}
                      className="text-copy-muted hover:text-state-error"
                    >
                      <X />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={handleCopyLink} className="gap-1.5">
            {copied ? <Check className="h-3.5 w-3.5 text-state-success" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied!" : "Copy Link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CollabAvatar({
  name,
  avatarUrl,
  email,
}: {
  name: string | null
  avatarUrl: string | null
  email: string
}) {
  const initials = name
    ? (name.trim().split(/\s+/).filter(Boolean).map((p) => p[0]).join("").toUpperCase().slice(0, 2) || email[0].toUpperCase())
    : email[0].toUpperCase()

  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={name ?? email}
        width={32}
        height={32}
        className="size-8 rounded-full ring-1 ring-border"
      />
    )
  }

  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand/15 text-xs font-semibold text-brand ring-1 ring-brand/30">
      {initials}
    </div>
  )
}
