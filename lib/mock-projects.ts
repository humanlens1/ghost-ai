export type Project = {
  id: string
  name: string
  slug: string
  owned: boolean
}

export const mockProjects: Project[] = [
  { id: "1", name: "Ghost AI Core", slug: "ghost-ai-core", owned: true },
  { id: "2", name: "Architecture Workspace", slug: "architecture-workspace", owned: true },
  { id: "3", name: "Team Design System", slug: "team-design-system", owned: false },
]
