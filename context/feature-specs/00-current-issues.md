### 1. ~~Save Button in Workspace Navbar~~ — **Works**

**Fix applied (2026-05-07):**
- `useAutosave` now returns `triggerSave` — cancels any pending debounce and immediately saves with the latest nodes/edges (via stable refs)
- `CanvasEditor` accepts a `triggerSaveRef` and sets `ref.current = triggerSave` so the shell can call it without prop-drilling a callback
- `WorkspaceShell` holds `triggerSaveRef` and passes `onSave={() => triggerSaveRef.current?.()}` to the navbar
- `WorkspaceNavbar` gains an optional `onSave` prop; the Save button renders only when `onSave` is provided (editor home uses `EditorNavbar` and never passes this prop, so no button appears there)
- Button tracks a local `displayStatus` state: "saved" and "error" both reset to "idle" after 2 s via `useEffect`; colors match the status (green for saved, red for error)
- Old status text label next to the project name removed (button communicates the same info)

**To test:**
- Open the workspace canvas — a "Save" button appears in the top-right between Templates and Share
- Click Save → shows "Saving…" (disabled) then "Saved" briefly, then returns to "Save"
- Move a node (autosave triggers) → button shows "Saving…" → "Saved" briefly
- Simulate a save failure → button shows "Error" briefly then "Save"
- Open the editor home (`/editor`) — confirm the Save button does NOT appear in that navbar


### 2 ~~Save failed on canvas autosave~~ — **Works**

**Root cause:** The canvas route used `@vercel/blob` `put()` which requires a `BLOB_READ_WRITE_TOKEN` env var. Without it the PUT always returned 500, triggering the "save failed" notification. Data appeared to persist only because Liveblocks independently preserves room state.

**Fix applied (2026-05-07):**
- Removed `@vercel/blob` from the canvas route entirely
- Canvas JSON is now stored directly in PostgreSQL via a new `canvasJson` (`JSONB`) column on the `projects` table
- Migration `20260507000000_canvas_json_db` applied and Prisma client regenerated
- `canvasJsonPath` column dropped; GET handler now reads from DB, no external fetch needed

**To test:**
- Load the canvas page — the navbar should show "Saved" (not "Save failed") after the first autosave
- Move a node — should save and show "Saved"
- Refresh — nodes should still be in the same positions (loaded from DB)
- Open an incognito window as a different user — nodes should reflect what the primary user last saved

### 3 Delete Nodes and Edges
- Current there is no way to delete nodes
- I should be able to click a node and hit "Back" or "delete" to clear it
- crtl-z should get deleted nodes back
- removes the node from the existing liveblocks collaborative
- If text is being editted, do not fire to stop a random node to being deleted

### 4 Clear Mouse Feedback
- When I hover a node, I should see a pointer
- When I hover something clickable, please give me a pointer
- Ignore when hovering a text field

### 5 Floating Node Tool bar
- If I grab a node and drag it back into the tool bar, it should deactivate from the mouse

### 6 Auto Zoom on first node
- Read Liveblocks agent skills before implementing this
Dropping the first node onto a fully empty canvas should force a zoom-in. This should not happen when other nodes exist.
Disable or guard any automatic fit/zoom behavior so it does not fire during a drop event. The viewport should stay exactly where the user left it after dropping a node.

### 7 Remove User button
- It is great to show the non-account users below the profile icon, but they should not be clickable. 
- On hover, it should show the username of the collaborator. 
- If you click on the icon, you can have an option to "remove user"




