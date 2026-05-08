import { clerkClient } from "@clerk/nextjs/server";
import { getAuthIdentity } from "@/lib/project-access";
import { getLiveblocks } from "@/lib/liveblocks";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const identity = await getAuthIdentity();
  if (!identity) return new Response("Unauthorized", { status: 401 });

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  });
  if (!project || project.ownerId !== identity.userId) {
    return new Response("Forbidden", { status: 403 });
  }

  const { userId: targetUserId } = (await req.json()) as { userId: string };
  if (!targetUserId) return new Response("Bad Request", { status: 400 });

  const lb = getLiveblocks();

  // Notify the target user's client immediately so they see the message
  await lb.broadcastEvent(projectId, { type: "KICKED", userId: targetUserId });

  // Revoke their room access so re-auth fails immediately
  await lb.updateRoom(projectId, {
    usersAccesses: { [targetUserId]: [] },
  });

  // Remove from project collaborators if they were invited by email
  const client = await clerkClient();
  try {
    const targetUser = await client.users.getUser(targetUserId);
    const email = targetUser.emailAddresses[0]?.emailAddress;
    if (email) {
      await prisma.projectCollaborator.deleteMany({
        where: { projectId, email },
      });
    }
  } catch {
    // User lookup failed — room access already revoked above
  }

  return new Response("OK");
}
