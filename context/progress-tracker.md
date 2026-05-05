# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- 05-prisma (complete)

## Current Goal

- Add the Prisma data layer with Project and ProjectCollaborator models.

## Completed

- 01-design-system: shadcn/ui installed and configured. Components: Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea. lucide-react installed. lib/utils.ts cn() helper in place. Dark theme active via .dark on <html>. All type-check clean.
- 02-editor-chrome: EditorNavbar (fixed top bar, sidebar toggle with PanelLeftOpen/PanelLeftClose) and ProjectSidebar (overlay panel, Tabs for My Projects/Shared, New Project button) created. Dialog pattern ready via existing components/ui/dialog.tsx and globals.css color tokens.
- 03-auth: ClerkProvider in root layout with CSS-variable appearance overrides. proxy.ts with clerkMiddleware protects all routes except /sign-in and /sign-up. Sign-in and sign-up pages use two-panel layout (50/50 on large screens, form-only on small). Root / redirects to /editor (auth) or /sign-in (unauth). UserButton added to EditorNavbar right section. @clerk/ui installed. npm run build passes.
- 04-project-dialogs: Editor home screen (heading + description + New Project button). useProjectDialogs hook owns dialog/form/loading state. Create/Rename/Delete dialogs with slug preview, auto-focus, destructive styling. Sidebar project items with Pencil/Trash2 actions (owned only), mobile backdrop scrim. ProjectDialogsContext shares handlers to editor page. Mock data only.
- 05-prisma: Project and ProjectCollaborator models in prisma/models/project.prisma. Prisma client singleton in lib/prisma.ts branches on DATABASE_URL (prisma+postgres:// → accelerateUrl, else PrismaPg adapter). Migration applied. Client generated to app/generated/prisma/.

## In Progress

- None.

## Next Up

- 06: Add the next planned feature unit here.

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
- Mock data: `lib/mock-projects.ts` — Project type + mockProjects array.
