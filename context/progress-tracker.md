# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- 07-wire-editor-home (complete)

## Current Goal

- Wire the editor home sidebar and dialogs to the real project API.

## Completed

- 01-design-system: shadcn/ui installed and configured. Components: Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea. lucide-react installed. lib/utils.ts cn() helper in place. Dark theme active via .dark on <html>. All type-check clean.
- 02-editor-chrome: EditorNavbar (fixed top bar, sidebar toggle with PanelLeftOpen/PanelLeftClose) and ProjectSidebar (overlay panel, Tabs for My Projects/Shared, New Project button) created. Dialog pattern ready via existing components/ui/dialog.tsx and globals.css color tokens.
- 03-auth: ClerkProvider in root layout with CSS-variable appearance overrides. proxy.ts with clerkMiddleware protects all routes except /sign-in and /sign-up. Sign-in and sign-up pages use two-panel layout (50/50 on large screens, form-only on small). Root / redirects to /editor (auth) or /sign-in (unauth). UserButton added to EditorNavbar right section. @clerk/ui installed. npm run build passes.
- 04-project-dialogs: Editor home screen (heading + description + New Project button). useProjectDialogs hook owns dialog/form/loading state. Create/Rename/Delete dialogs with slug preview, auto-focus, destructive styling. Sidebar project items with Pencil/Trash2 actions (owned only), mobile backdrop scrim. ProjectDialogsContext shares handlers to editor page. Mock data only.
- 05-prisma: Project and ProjectCollaborator models in prisma/models/project.prisma. Prisma client singleton in lib/prisma.ts branches on DATABASE_URL (prisma+postgres:// → accelerateUrl, else PrismaPg adapter). Migration applied. Client generated to app/generated/prisma/.
- 06-project-apis: REST route handlers for GET /api/projects and POST /api/projects in app/api/projects/route.ts; PATCH and DELETE /api/projects/[projectId] in app/api/projects/[projectId]/route.ts. Auth via @clerk/nextjs/server auth(). 401 for unauthenticated, 403 for non-owner mutations. POST defaults missing name to "Untitled Project". npm run build passes.
- 07-wire-editor-home: Editor home page converted to server component. Layout fetches owned + shared projects server-side via getProjectsForUser() (lib/data/projects.ts) and passes them to EditorShell. useProjectActions hook (hooks/use-project-actions.ts) handles create/rename/delete via REST API + router.refresh()/push(). Create dialog shows room ID preview (slug + short suffix); project ID and room ID stay aligned. POST /api/projects accepts optional custom id. npm run build passes.

## In Progress

- None.

## Next Up

- 08: Add the next planned feature unit here.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- ProjectSidebar is a floating overlay (position: fixed) — opening it does not shift page content.
- Sidebar and navbar state (isOpen, onToggle) are owned by the parent layout/page, passed down as props.
- useProjectDialogs hook owns all dialog/form/loading state; used in EditorShell and shared to child pages via ProjectDialogsContext.
- ProjectSidebar receives dialog open handlers as props (onCreateProject, onRenameProject, onDeleteProject).
- Mobile sidebar backdrop is a fixed full-screen div (md:hidden) rendered before the aside element.

## Session Notes

- EditorNavbar: `components/editor/editor-navbar.tsx` — accepts `isSidebarOpen` + `onSidebarToggle` props.
- ProjectSidebar: `components/editor/project-sidebar.tsx` — accepts `isOpen`, `onClose`, `onCreateProject`, `onRenameProject`, `onDeleteProject` props.
- Project dialogs: `components/editor/project-dialogs.tsx` — CreateProjectDialog, RenameProjectDialog, DeleteProjectDialog.
- Dialog context: `components/editor/project-dialogs-context.tsx` — ProjectDialogsContext + useProjectDialogsContext hook.
- Dialog hook: `hooks/use-project-dialogs.ts` — useProjectDialogs.
- Mock data: `lib/mock-projects.ts` — superseded; shared type now in `lib/projects.ts` (ProjectItem + toSlug).
- Project API routes: `app/api/projects/route.ts` (GET list, POST create — accepts optional id), `app/api/projects/[projectId]/route.ts` (PATCH rename, DELETE delete).
- Server data helper: `lib/data/projects.ts` — getProjectsForUser() returns { owned, shared } ProjectItem arrays via Prisma + Clerk currentUser().
- Project actions hook: `hooks/use-project-actions.ts` — useProjectActions() manages dialog state + async mutations; generates roomId (slug + shortSuffix) for create.
- Editor home: `app/(editor)/editor/page.tsx` is a server component; interactive button extracted to `components/editor/editor-home-content.tsx` (client).
- Editor layout: `app/(editor)/layout.tsx` is async server component; fetches projects and passes to EditorShell as ownedProjects/sharedProjects props.
