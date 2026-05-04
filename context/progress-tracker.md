# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- 03-auth

## Current Goal

- Wire Clerk into the Next.js app: provider, auth pages, redirects, route protection, and user menu.

## Completed

- 01-design-system: shadcn/ui installed and configured. Components: Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea. lucide-react installed. lib/utils.ts cn() helper in place. Dark theme active via .dark on <html>. All type-check clean.
- 02-editor-chrome: EditorNavbar (fixed top bar, sidebar toggle with PanelLeftOpen/PanelLeftClose) and ProjectSidebar (overlay panel, Tabs for My Projects/Shared, New Project button) created. Dialog pattern ready via existing components/ui/dialog.tsx and globals.css color tokens.
- 03-auth: ClerkProvider in root layout with CSS-variable appearance overrides. proxy.ts with clerkMiddleware protects all routes except /sign-in and /sign-up. Sign-in and sign-up pages use two-panel layout (50/50 on large screens, form-only on small). Root / redirects to /editor (auth) or /sign-in (unauth). UserButton added to EditorNavbar right section. @clerk/ui installed. npm run build passes.

## In Progress

- None.

## Next Up

- 04: Add the next planned feature unit here.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- ProjectSidebar is a floating overlay (position: fixed) — opening it does not shift page content.
- Sidebar and navbar state (isOpen, onToggle) are owned by the parent layout/page, passed down as props.

## Session Notes

- EditorNavbar: `components/editor/editor-navbar.tsx` — accepts `isSidebarOpen` + `onSidebarToggle` props.
- ProjectSidebar: `components/editor/project-sidebar.tsx` — accepts `isOpen` + `onClose` props; slides in via `translate-x` transition.
- Dialog pattern: no new dialog built yet; use existing `components/ui/dialog.tsx` with globals.css tokens when needed.
