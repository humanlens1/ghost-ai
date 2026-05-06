import { redirect } from 'next/navigation'

import { getAuthIdentity, checkProjectAccess } from '@/lib/project-access'
import { getProjectsForUser } from '@/lib/data/projects'
import { AccessDenied } from '@/components/editor/access-denied'
import { WorkspaceShell } from '@/components/editor/workspace-shell'

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ roomId: string }>
}) {
  const { roomId } = await params

  const identity = await getAuthIdentity()
  if (!identity) redirect('/sign-in')

  const project = await checkProjectAccess(roomId, identity)
  if (!project) return <AccessDenied />

  const { owned, shared } = await getProjectsForUser()

  return (
    <WorkspaceShell
      project={project}
      projects={[...owned, ...shared]}
      activeProjectId={roomId}
      isOwner={project.isOwner}
    />
  )
}
