import Link from 'next/link'
import { Ghost } from 'lucide-react'

export function AccessDenied() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-5 text-center px-4">
      <div className="flex items-center justify-center size-16 rounded-2xl bg-elevated ring-1 ring-border">
        <Ghost className="h-8 w-8 text-copy-muted" />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold text-foreground">Access Denied</h1>
        <p className="max-w-xs text-sm text-copy-muted leading-relaxed">
          You don&apos;t have permission to view this project, or it doesn&apos;t exist.
        </p>
      </div>
      <Link
        href="/editor"
        className="inline-flex items-center gap-1.5 rounded-lg bg-elevated px-4 py-2 text-sm font-medium text-foreground ring-1 ring-border transition-colors hover:bg-subtle hover:ring-border-subtle"
      >
        Back to editor
      </Link>
    </div>
  )
}
