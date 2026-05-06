import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import type { ProjectItem } from '@/lib/projects'

export async function getProjectsForUser(): Promise<{
  owned: ProjectItem[]
  shared: ProjectItem[]
}> {
  const { userId } = await auth()
  if (!userId) return { owned: [], shared: [] }

  const ownedRaw = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true },
  })

  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress ?? null

  const sharedRaw = email
    ? await prisma.project.findMany({
        where: {
          collaborators: { some: { email } },
          NOT: { ownerId: userId },
        },
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true },
      })
    : []

  return {
    owned: ownedRaw.map((p) => ({ ...p, owned: true })),
    shared: sharedRaw.map((p) => ({ ...p, owned: false })),
  }
}
