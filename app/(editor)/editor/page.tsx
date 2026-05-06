import { Ghost } from "lucide-react"
import { EditorHomeContent } from "@/components/editor/editor-home-content"

export default function EditorPage() {
  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex items-center justify-center size-20 rounded-3xl bg-elevated ring-1 ring-border shadow-lg">
        <Ghost className="h-10 w-10 text-brand" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-2.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Welcome to Ghost AI
        </h1>
        <p className="max-w-sm text-sm text-copy-muted leading-relaxed">
          Create a new project to get started, or open an existing one from the sidebar.
        </p>
      </div>
      <EditorHomeContent />
    </div>
  )
}
