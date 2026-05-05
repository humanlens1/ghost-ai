import { EditorHomeContent } from "@/components/editor/editor-home-content"

export default function EditorPage() {
  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Create a project or open an existing one
      </h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        Start a new architecture workspace, or choose a project from the sidebar.
      </p>
      <EditorHomeContent />
    </div>
  )
}
