import { put } from '@vercel/blob'
import { prisma } from '@/lib/prisma'
import { getAuthIdentity, checkProjectAccess } from '@/lib/project-access'

export async function PUT(
  request: Request,
  ctx: RouteContext<'/api/projects/[projectId]/canvas'>
) {
  const identity = await getAuthIdentity()
  if (!identity) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { projectId } = await ctx.params
  const access = await checkProjectAccess(projectId, identity)
  if (!access) return Response.json({ error: 'Not found' }, { status: 404 })

  const body = await request.json()

  try {
    const blob = await put(`canvas/${projectId}.json`, JSON.stringify(body), {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
    })
    await prisma.project.update({
      where: { id: projectId },
      data: { canvasJsonPath: blob.url },
    })
    return Response.json({ ok: true })
  } catch (err) {
    console.error('[canvas PUT] error:', err)
    return Response.json({ error: 'Failed to save canvas' }, { status: 500 })
  }
}

export async function GET(
  _request: Request,
  ctx: RouteContext<'/api/projects/[projectId]/canvas'>
) {
  const identity = await getAuthIdentity()
  if (!identity) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { projectId } = await ctx.params
  const access = await checkProjectAccess(projectId, identity)
  if (!access) return Response.json({ error: 'Not found' }, { status: 404 })

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { canvasJsonPath: true },
  })

  if (!project?.canvasJsonPath) return Response.json({ nodes: [], edges: [] })

  try {
    const res = await fetch(project.canvasJsonPath)
    if (!res.ok) return Response.json({ nodes: [], edges: [] })
    return Response.json(await res.json())
  } catch {
    return Response.json({ nodes: [], edges: [] })
  }
}
