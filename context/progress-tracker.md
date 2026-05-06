# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- 18-starter-templates (complete)

## Current Goal

- Starter template library with import modal and canvas replacement.

## Completed

- 01-design-system: shadcn/ui installed and configured. Components: Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea. lucide-react installed. lib/utils.ts cn() helper in place. Dark theme active via .dark on <html>. All type-check clean.
- 02-editor-chrome: EditorNavbar (fixed top bar, sidebar toggle with PanelLeftOpen/PanelLeftClose) and ProjectSidebar (overlay panel, Tabs for My Projects/Shared, New Project button) created. Dialog pattern ready via existing components/ui/dialog.tsx and globals.css color tokens.
- 03-auth: ClerkProvider in root layout with CSS-variable appearance overrides. proxy.ts with clerkMiddleware protects all routes except /sign-in and /sign-up. Sign-in and sign-up pages use two-panel layout (50/50 on large screens, form-only on small). Root / redirects to /editor (auth) or /sign-in (unauth). UserButton added to EditorNavbar right section. @clerk/ui installed. npm run build passes.
- 04-project-dialogs: Editor home screen (heading + description + New Project button). useProjectDialogs hook owns dialog/form/loading state. Create/Rename/Delete dialogs with slug preview, auto-focus, destructive styling. Sidebar project items with Pencil/Trash2 actions (owned only), mobile backdrop scrim. ProjectDialogsContext shares handlers to editor page. Mock data only.
- 05-prisma: Project and ProjectCollaborator models in prisma/models/project.prisma. Prisma client singleton in lib/prisma.ts branches on DATABASE_URL (prisma+postgres:// → accelerateUrl, else PrismaPg adapter). Migration applied. Client generated to app/generated/prisma/.
- 06-project-apis: REST route handlers for GET /api/projects and POST /api/projects in app/api/projects/route.ts; PATCH and DELETE /api/projects/[projectId] in app/api/projects/[projectId]/route.ts. Auth via @clerk/nextjs/server auth(). 401 for unauthenticated, 403 for non-owner mutations. POST defaults missing name to "Untitled Project". npm run build passes.
- 07-wire-editor-home: Editor home page converted to server component. Layout fetches owned + shared projects server-side via getProjectsForUser() (lib/data/projects.ts) and passes them to EditorShell. useProjectActions hook (hooks/use-project-actions.ts) handles create/rename/delete via REST API + router.refresh()/push(). Create dialog shows room ID preview (slug + short suffix); project ID and room ID stay aligned. POST /api/projects accepts optional custom id. npm run build passes.
- 08-editor-workspace-shell: /editor/[roomId] server component in app/(workspace) route group (own layout, no EditorShell). lib/project-access.ts provides getAuthIdentity() and checkProjectAccess(). Unauthenticated users redirect to /sign-in; missing/unauthorized projects render AccessDenied. WorkspaceShell (client) owns sidebar + AI panel state; WorkspaceNavbar shows project name, Share button (disabled), AI toggle, UserButton. ProjectSidebar updated with optional activeProjectId prop that highlights the current room. npm run build passes, no TypeScript errors.
- 09-share-dialog: ShareDialog component (components/editor/share-dialog.tsx) opens from the Share button in WorkspaceNavbar. Owners can invite by email (POST /api/projects/[projectId]/collaborators), remove collaborators (DELETE /api/projects/[projectId]/collaborators/[email]), and copy the project link with temporary "Copied!" feedback. Collaborators see a read-only list. Collaborator names and avatars are enriched via Clerk Backend API (clerkClient().users.getUserList); falls back to email-only when no Clerk user found. checkProjectAccess() in lib/project-access.ts now returns isOwner. next.config.ts adds remotePatterns for img.clerk.com and images.clerk.dev. npm run build passes.
- 10-liveblocks-setup: liveblocks.config.ts defines Presence (cursor + isThinking) and UserMeta (name, avatar, cursorColor). Cached node client via getLiveblocks() in lib/liveblocks.ts (lazy init to avoid build-time crash). getCursorColor() deterministically maps userId to one of 8 hex colors. POST /api/liveblocks-auth requires Clerk auth, verifies project access via checkProjectAccess(), calls getOrCreateRoom() with private defaultAccesses, returns identifyUser() session with name/avatar/cursorColor. @liveblocks/node installed. npm run build passes.
- 11-base-canvas: CanvasWrapper (components/editor/canvas-wrapper.tsx) sets up LiveblocksProvider + RoomProvider (initialPresence cursor:null, isThinking:false) with ErrorBoundary + ClientSideSuspense. Inner CanvasEditor uses useLiveblocksFlow (suspense, empty initial nodes/edges) wired into ReactFlow with ConnectionMode.Loose, fitView, MiniMap, dot-pattern Background, and Cursors. Shared canvas types in types/canvas.ts (CanvasNodeData with label/color/shape, CanvasNode, CanvasEdge). WorkspaceShell canvas placeholder replaced with CanvasWrapper. react-error-boundary installed. npm run build passes.
- 12-shape-panel: ShapePanel (components/editor/shape-panel.tsx) — floating pill toolbar at bottom-center (via ReactFlow Panel); draggable buttons for rectangle/diamond/circle/pill/cylinder/hexagon with shape+size drag payload (application/ghost-shape MIME type). CanvasWrapper split into CanvasEditor (wraps with ReactFlowProvider + calls useLiveblocksFlow) + FlowCanvas (calls useReactFlow for screenToFlowPosition, handles dragover/drop, renders ReactFlow). CanvasNodeComponent (components/editor/canvas-node.tsx) — custom canvasNode renderer (bordered rectangle, centered label, top+bottom Handles). nodeTypes map defined at module level. Node IDs use shape-timestamp-counter pattern. npm run build passes.
- 13-node-shape: ShapeRenderer (exported from components/editor/canvas-node.tsx) — renders all six shapes: CSS div with border-radius for rectangle/pill/circle; inline SVG (preserveAspectRatio="none") for diamond/hexagon/cylinder. Borders use border-border at rest and border-primary when selected. CanvasNodeComponent updated to use ShapeRenderer with label overlay and top/bottom Handles. ShapePanel (components/editor/shape-panel.tsx) adds drag preview: native drag image suppressed, document dragover listener (rAF-throttled) tracks cursor, createPortal renders ShapeRenderer at 65% opacity fixed to cursor; cleared on dragend. npm run build passes.
- 14-node-editing: NodeResizer added to CanvasNodeComponent (isVisible when selected, minWidth=60, minHeight=40, subtle border/handle styles using CSS vars). Inline label editing: double-click opens textarea overlay (centered, transparent, stopPropagation on mouse/pointer down to block drag). Commit on blur or Escape dispatches onNodesChange([{type:"replace",...}]) from a FlowActionsContext (defined in canvas-node.tsx, provided in CanvasEditor wrapping ReactFlowProvider). getNode(id) from useReactFlow() fetches current node for the replace payload. Placeholder text shown when label is empty. npm run build passes.
- 15-node-color-toolbar: NODE_COLORS (8 fill/text pairs) and NodeColor interface added to types/canvas.ts. CanvasNodeData gains textColor field. ShapeRenderer accepts bgColor prop (applied as inline backgroundColor for CSS shapes, as SVG fill for SVG shapes). NodeColorToolbar (floating pill above selected nodes, stopPropagation on all pointer events) renders SwatchButton per color pair. Active swatch shows white outline ring; hover shows tight text-color glow via box-shadow. handleColorSelect dispatches onNodesChange replace change updating both color and textColor fields. Label text uses textColor with muted placeholder fallback. npm run build passes.
- 16-edge-behavior: CanvasEdgeData interface (label?: string) added to types/canvas.ts; CanvasEdge updated to use it. CanvasEdgeComponent (components/editor/canvas-edge.tsx) — getSmoothStepPath for right-angle routing + midpoint coords; <g> with opacity 0.45→1 transition on hover/select; 20px-wide transparent hit-target path for easier clicking; BaseEdge (interactionWidth=0); EdgeLabelRenderer at getSmoothStepPath midpoint (labelX, labelY); double-click starts edit; auto-sizing input (ch units); saves on blur/Enter/Escape via onEdgesChange replace through FlowEdgesContext; pill badge for saved labels; faint hint when active+no label; nodrag nopan + stopPropagation to block canvas pan. CanvasNodeComponent gains 4 handles (top/right/bottom/left) with opacity 0→1 on node hover or select; small white dot style with dark border. FlowEdgesContext provided in CanvasEditor alongside FlowActionsContext. FlowCanvas custom handleConnect uses onEdgesChange add change to ensure type:"canvasEdge" on all new connections. defaultEdgeOptions sets type, markerEnd (ArrowClosed), and stroke style. edgeTypes map defined at module level. npm run build passes.
- 17-canvas-ergonomics: ControlBar (pill-shaped, bottom-left Panel) added to canvas-wrapper.tsx — zoom out/fit view/zoom in wired to useReactFlow() with 200–300ms duration animation, undo/redo wired to useUndo/useRedo/useCanUndo/useCanRedo from @liveblocks/react with disabled+dimmed states. useKeyboardShortcuts hook (hooks/useKeyboardShortcuts.ts) receives flow + undo/redo, listens on window, ignores editable targets; supports +/= zoom in, - zoom out, Cmd/Ctrl+Z undo, Cmd/Ctrl+Shift+Z redo, Cmd/Ctrl+Y redo. npm run build passes.
- 18-starter-templates: CanvasTemplate type + CANVAS_TEMPLATES array (microservices, CI/CD pipeline, event-driven) in components/editor/starter-templates.ts. TemplateImportContext (ref-based) exported from same file. StarterTemplatesModal (components/editor/starter-templates-modal.tsx) — Dialog with scrollable 1–3 column grid; each card shows SVG preview (pure-SVG, no React Flow; calculates bounds, scales to fit 220×120 viewport, draws edges as lines and nodes as colored shapes) + name + description + Import button. FlowCanvas (canvas-wrapper.tsx) consumes TemplateImportContext and populates the ref with a handler that replaces nodes+edges via onNodesChange/onEdgesChange and calls fitView after 50ms. WorkspaceShell provides context, owns isTemplatesOpen state, calls importRef.current on import. WorkspaceNavbar gains LayoutTemplate icon button (onTemplatesOpen prop). npm run build passes.

## In Progress

- None.

## Next Up

- 19: Add the next planned feature unit here.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- ProjectSidebar is a floating overlay (position: fixed) — opening it does not shift page content.
- Sidebar and navbar state (isOpen, onToggle) are owned by the parent layout/page, passed down as props.
- useProjectDialogs hook owns all dialog/form/loading state; used in EditorShell and shared to child pages via ProjectDialogsContext.
- ProjectSidebar receives dialog open handlers as props (onCreateProject, onRenameProject, onDeleteProject).
- Mobile sidebar backdrop is a fixed full-screen div (md:hidden) rendered before the aside element.
- Workspace route lives in app/(workspace) route group so it has no EditorShell wrapper; root layout (ClerkProvider) still applies.
- WorkspaceShell is a client component that owns isSidebarOpen + isAiPanelOpen state; it reuses ProjectSidebar and dialog infrastructure from EditorShell.

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
- Access helpers: `lib/project-access.ts` — getAuthIdentity() (Clerk userId + primary email), checkProjectAccess(projectId, identity) (owner or collaborator check via Prisma).
- AccessDenied component: `components/editor/access-denied.tsx` — centered lock icon, message, link back to /editor.
- Workspace navbar: `components/editor/workspace-navbar.tsx` — shows project name, disabled Share button, AI panel toggle, UserButton.
- Workspace shell: `components/editor/workspace-shell.tsx` — client, owns sidebar + AI panel state, renders WorkspaceNavbar + ProjectSidebar + canvas placeholder + AI sidebar placeholder.
- Workspace page: `app/(workspace)/editor/[roomId]/page.tsx` — server component; redirects unauth to /sign-in, shows AccessDenied for missing/unauthorized projects, renders WorkspaceShell with project + projects + activeProjectId + isOwner.
- ProjectSidebar: added optional activeProjectId prop; matching project item gets bg-muted/70 highlight.
- Share dialog: `components/editor/share-dialog.tsx` — Dialog for sharing; owners see invite input + remove buttons; collaborators see read-only list; copy-link with "Copied!" feedback.
- Collaborators API: `app/api/projects/[projectId]/collaborators/route.ts` (GET list + POST invite), `app/api/projects/[projectId]/collaborators/[email]/route.ts` (DELETE remove). Ownership enforced server-side for mutating operations.
- Access helper updated: `lib/project-access.ts` checkProjectAccess() now returns isOwner boolean.
- Image config: `next.config.ts` remotePatterns for img.clerk.com + images.clerk.dev.
- Liveblocks node client: `lib/liveblocks.ts` — getLiveblocks() (lazy cached), getCursorColor(userId) deterministic color from 8-color palette.
- Liveblocks auth route: `app/api/liveblocks-auth/route.ts` — POST, Clerk auth + checkProjectAccess, getOrCreateRoom, identifyUser with name/avatar/cursorColor.
- Canvas types: `types/canvas.ts` — CanvasNodeData (label, color, shape), CanvasNode (Node<CanvasNodeData, "canvasNode">), CanvasEdge (Edge<…, "canvasEdge">).
- Canvas wrapper: `components/editor/canvas-wrapper.tsx` — CanvasWrapper (LiveblocksProvider + RoomProvider + ErrorBoundary + ClientSideSuspense) + CanvasEditor (ReactFlowProvider + useLiveblocksFlow) + FlowCanvas (useReactFlow, dragover/drop, ReactFlow with MiniMap/Background dots/Cursors/ControlBar/ShapePanel Panel, fitView, ConnectionMode.Loose, nodeTypes). ControlBar (bottom-left Panel) — zoom out/fit view/zoom in + undo/redo; useKeyboardShortcuts wired here.
- Keyboard shortcuts hook: `hooks/useKeyboardShortcuts.ts` — useKeyboardShortcuts(flow, undo, redo); ignores editable targets.
- Canvas node: `components/editor/canvas-node.tsx` — exports ShapeRenderer, CanvasNodeComponent, and FlowActionsContext. NodeResizer (isVisible=selected). Inline label editing: double-click → textarea overlay, commit on blur/Escape via onNodesChange replace change. getNode(id) from useReactFlow for current node state. NodeColorToolbar (floating pill) + SwatchButton (16px circles) shown when selected; swatch click dispatches replace change for color+textColor. NODE_COLORS palette in types/canvas.ts. 4 handles (top/right/bottom/left) with hover+selected-gated opacity fade-in; small white dot style.
- Canvas edge: `components/editor/canvas-edge.tsx` — exports CanvasEdgeComponent and FlowEdgesContext. getSmoothStepPath routing; opacity-based hover/select brightening via <g> wrapper; 20px transparent hit path; BaseEdge; EdgeLabelRenderer at midpoint; inline label editing with auto-sizing input; pill badge for saved labels; faint hint when active+no label; nodrag nopan classes + stopPropagation.
- Shape panel: `components/editor/shape-panel.tsx` — ShapePanel + ShapeDragPayload; draggable buttons for 6 shapes; drag preview via createPortal (ShapeRenderer at cursor, 65% opacity, rAF-throttled position tracking, native drag image suppressed).
