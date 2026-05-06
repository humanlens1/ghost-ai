import { currentUser } from '@clerk/nextjs/server'
import { getAuthIdentity, checkProjectAccess } from '@/lib/project-access'
import { getLiveblocks, getCursorColor } from '@/lib/liveblocks'

export async function POST(request: Request) {
  const identity = await getAuthIdentity()
  if (!identity) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { room } = await request.json()
  const projectId = room as string

  const project = await checkProjectAccess(projectId, identity)
  if (!project) {
    return new Response('Forbidden', { status: 403 })
  }

  const lb = getLiveblocks()
  await lb.getOrCreateRoom(projectId, { defaultAccesses: [] })

  // Grant write access to this user — required with ID token auth.
  // checkProjectAccess above already verified they have project membership.
  await lb.updateRoom(projectId, {
    usersAccesses: { [identity.userId]: ['room:write'] },
  })

  const user = await currentUser()
  const name =
    user?.fullName ??
    user?.username ??
    user?.emailAddresses[0]?.emailAddress ??
    'Unknown'
  const avatar = user?.imageUrl ?? ''
  const cursorColor = getCursorColor(identity.userId)

  const { status, body } = await lb.identifyUser(
    { userId: identity.userId, groupIds: [] },
    { userInfo: { name, avatar, cursorColor } }
  )

  return new Response(body, { status })
}
