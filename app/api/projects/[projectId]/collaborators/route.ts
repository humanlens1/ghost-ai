import { auth, currentUser, clerkClient } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { projectId } = await params

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, ownerId: true },
  })
  if (!project) return Response.json({ error: 'Not found' }, { status: 404 })

  const isOwner = project.ownerId === userId

  if (!isOwner) {
    const user = await currentUser()
    const email = user?.emailAddresses[0]?.emailAddress
    if (!email) return Response.json({ error: 'Forbidden' }, { status: 403 })

    const collab = await prisma.projectCollaborator.findUnique({
      where: { projectId_email: { projectId: project.id, email } },
    })
    if (!collab) return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const rows = await prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: 'asc' },
    select: { email: true },
  })

  const emails = rows.map((r) => r.email)
  let collaborators: { email: string; name: string | null; avatarUrl: string | null }[] = rows.map(
    (r) => ({ email: r.email, name: null, avatarUrl: null })
  )

  if (emails.length > 0) {
    const client = await clerkClient()
    const { data: users } = await client.users.getUserList({ emailAddress: emails })
    const byEmail = new Map(users.flatMap((u) => u.emailAddresses.map((ea) => [ea.emailAddress, u])))
    collaborators = rows.map((r) => {
      const u = byEmail.get(r.email)
      return {
        email: r.email,
        name: u ? (`${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || u.username || null) : null,
        avatarUrl: u?.imageUrl ?? null,
      }
    })
  }

  return Response.json({ collaborators, isOwner })
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { projectId } = await params

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, ownerId: true },
  })
  if (!project) return Response.json({ error: 'Not found' }, { status: 404 })
  if (project.ownerId !== userId) return Response.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json().catch(() => ({}))
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!email || !email.includes('@')) return Response.json({ error: 'Invalid email' }, { status: 400 })

  // Prevent adding the owner as a collaborator on their own project
  const client = await clerkClient()
  const ownerUser = await client.users.getUser(project.ownerId)
  const ownerEmails = ownerUser.emailAddresses.map((e) => e.emailAddress.toLowerCase())
  if (ownerEmails.includes(email)) {
    return Response.json({ error: 'Cannot invite the project owner' }, { status: 400 })
  }

  await prisma.projectCollaborator.upsert({
    where: { projectId_email: { projectId, email } },
    create: { projectId, email },
    update: {},
  })

  return new Response(null, { status: 204 })
}
