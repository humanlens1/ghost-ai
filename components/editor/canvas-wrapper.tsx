"use client";

import { createPortal } from "react-dom";
import { useContext, useEffect, useState, type DragEvent } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
  useUndo,
  useRedo,
  useCanUndo,
  useCanRedo,
  useOthers,
  useUpdateMyPresence,
  useEventListener,
  useSelf,
} from "@liveblocks/react";
import {
  ReactFlow,
  ReactFlowProvider,
  MiniMap,
  Background,
  BackgroundVariant,
  ConnectionMode,
  MarkerType,
  Panel,
  useReactFlow,
  type OnNodesChange,
  type OnEdgesChange,
  type OnDelete,
  type NodeTypes,
  type EdgeTypes,
  type Connection,
} from "@xyflow/react";
import { useLiveblocksFlow } from "@liveblocks/react-flow";
import { useUser, UserButton } from "@clerk/nextjs";
import { Minus, Plus, Maximize2, Undo2, Redo2, X, ShieldOff } from "lucide-react";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useAutosave, type SaveStatus } from "@/hooks/useAutosave";

export type { SaveStatus };
import { ErrorBoundary } from "react-error-boundary";
import "@xyflow/react/dist/style.css";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-flow/styles.css";

import type { CanvasNode, CanvasEdge } from "@/types/canvas";
import { CanvasNodeComponent, FlowActionsContext } from "./canvas-node";
import { CanvasEdgeComponent, FlowEdgesContext } from "./canvas-edge";
import { ShapePanel, type ShapeDragPayload } from "./shape-panel";
import { TemplateImportContext, type CanvasTemplate } from "./starter-templates";

const nodeTypes: NodeTypes = {
  canvasNode: CanvasNodeComponent,
};

const edgeTypes: EdgeTypes = {
  canvasEdge: CanvasEdgeComponent,
};

const defaultEdgeOptions = {
  type: "canvasEdge",
  markerEnd: { type: MarkerType.ArrowClosed },
  style: { stroke: "var(--color-copy-muted)", strokeWidth: 1.5 },
};

let nodeCounter = 0;

// ─── Cursor pointer SVG ──────────────────────────────────────────────────────

function CursorArrow({ color }: { color: string }) {
  return (
    <svg width="12" height="16" viewBox="0 0 12 16" fill="none">
      <path
        d="M1 1L1 13L4.5 10L7 15L8.5 14L6 9.5L11 9.5L1 1Z"
        fill={color}
        stroke="white"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Single collaborator avatar ───────────────────────────────────────────────

type OtherInfo = { name: string; avatar: string; cursorColor: string };

interface CollaboratorAvatarProps {
  info: OtherInfo;
  onClick?: (e: React.MouseEvent) => void;
}

function CollaboratorAvatar({ info, onClick }: CollaboratorAvatarProps) {
  const initials = info.name
    .split(" ")
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="flex w-7 h-7 shrink-0 items-center justify-center rounded-full ring-2 ring-white/20 overflow-hidden text-[11px] font-semibold text-white"
      style={{
        backgroundColor: info.cursorColor,
        cursor: onClick ? "pointer" : "default",
      }}
      title={info.name}
      onClick={onClick}
    >
      {info.avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={info.avatar} alt={info.name} className="w-full h-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}

// ─── Live cursors overlay ─────────────────────────────────────────────────────

function LiveCursors() {
  const others = useOthers();
  const { flowToScreenPosition } = useReactFlow();

  return (
    <>
      {others.map(({ connectionId, presence, info }) => {
        if (!presence.cursor || !info) return null;
        const { x, y } = flowToScreenPosition(presence.cursor);
        return (
          <div
            key={connectionId}
            className="pointer-events-none fixed z-[60]"
            style={{ left: x, top: y }}
          >
            <CursorArrow color={info.cursorColor} />
            <div
              className="absolute left-3.5 top-3 rounded-full px-2 py-0.5 text-[11px] font-medium text-white whitespace-nowrap leading-tight"
              style={{ backgroundColor: info.cursorColor }}
            >
              {info.name}
            </div>
          </div>
        );
      })}
    </>
  );
}

// ─── Presence avatar group (top-right canvas panel) ──────────────────────────

interface PresenceAvatarGroupProps {
  isOwner: boolean;
  projectId: string;
}

function PresenceAvatarGroup({ isOwner, projectId }: PresenceAvatarGroupProps) {
  const { user } = useUser();
  const others = useOthers();
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [removing, setRemoving] = useState(false);

  const collaborators = others.filter((o) => o.id !== user?.id);
  const visible = collaborators.slice(0, 5);
  const overflow = collaborators.length - 5;

  async function handleRemoveUser(userId: string) {
    setRemoving(true);
    try {
      await fetch(`/api/projects/${projectId}/kick-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
    } catch {
      // silent — user will naturally lose access on next auth refresh
    } finally {
      setRemoving(false);
      setActiveUserId(null);
    }
  }

  return (
    <>
      {/* Transparent backdrop — catches outside clicks to close the popover.
          Rendered as a portal so it sits below the popover in z-order but above the canvas. */}
      {activeUserId && createPortal(
        <div className="fixed inset-0 z-40" onClick={() => setActiveUserId(null)} />,
        document.body
      )}

      <Panel position="top-right">
        <div className="flex items-center gap-1 mt-2 mr-2">
          {visible.length > 0 && (
            <div className="flex items-center">
              {visible.map(({ connectionId, info, id }, i) => (
                <div
                  key={connectionId}
                  className="relative"
                  style={{ marginLeft: i > 0 ? -8 : 0, zIndex: visible.length - i }}
                >
                  {info && (
                    <>
                      <CollaboratorAvatar
                        info={info}
                        onClick={isOwner ? (e) => { e.stopPropagation(); setActiveUserId(activeUserId === id ? null : id); } : undefined}
                      />
                      {isOwner && activeUserId === id && (
                        <div
                          className="absolute top-8 right-0 rounded-xl border border-border bg-elevated shadow-lg py-1 min-w-36 z-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <p className="px-3 py-1 text-[11px] text-copy-muted truncate max-w-48">{info.name}</p>
                          <div className="mx-2 my-1 h-px bg-border" />
                          <button
                            className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-state-error hover:bg-subtle transition-colors cursor-pointer"
                            onClick={() => handleRemoveUser(id)}
                            disabled={removing}
                          >
                            <X size={13} />
                            Remove user
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
              {overflow > 0 && (
                <div
                  className="relative flex w-7 h-7 items-center justify-center rounded-full ring-2 ring-white/20 bg-elevated text-[11px] font-semibold text-copy-muted"
                  style={{ marginLeft: -8, zIndex: 0 }}
                >
                  +{overflow}
                </div>
              )}
            </div>
          )}
          {collaborators.length > 0 && (
            <div className="w-px h-5 bg-white/20 mx-0.5 shrink-0" />
          )}
          <UserButton />
        </div>
      </Panel>
    </>
  );
}

// ─── Control bar (bottom-left) ────────────────────────────────────────────────

function ControlBar() {
  const flow = useReactFlow();
  const undo = useUndo();
  const redo = useRedo();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  useKeyboardShortcuts(flow, undo, redo);

  const btnClass =
    "flex items-center justify-center w-7 h-7 rounded-full text-copy-muted hover:text-copy hover:bg-fill transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer";

  return (
    <Panel position="bottom-left">
      <div className="flex items-center rounded-full bg-background/95 backdrop-blur border border-border shadow-lg px-1.5 py-1 mb-2 ml-2 gap-0.5">
        <button
          className={btnClass}
          onClick={() => flow.zoomOut({ duration: 200 })}
          title="Zoom out"
        >
          <Minus size={14} />
        </button>
        <button
          className={btnClass}
          onClick={() => flow.fitView({ duration: 300 })}
          title="Fit view"
        >
          <Maximize2 size={14} />
        </button>
        <button
          className={btnClass}
          onClick={() => flow.zoomIn({ duration: 200 })}
          title="Zoom in"
        >
          <Plus size={14} />
        </button>
        <div className="w-px h-4 bg-border mx-1 shrink-0" />
        <button
          className={btnClass}
          onClick={undo}
          disabled={!canUndo}
          title="Undo"
        >
          <Undo2 size={14} />
        </button>
        <button
          className={btnClass}
          onClick={redo}
          disabled={!canRedo}
          title="Redo"
        >
          <Redo2 size={14} />
        </button>
      </div>
    </Panel>
  );
}

// ─── Flow canvas ──────────────────────────────────────────────────────────────

interface FlowCanvasProps {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  onNodesChange: OnNodesChange<CanvasNode>;
  onEdgesChange: OnEdgesChange<CanvasEdge>;
  onDelete: OnDelete<CanvasNode, CanvasEdge>;
  isOwner: boolean;
  projectId: string;
}

function FlowCanvas({ nodes, edges, onNodesChange, onEdgesChange, onDelete, isOwner, projectId }: FlowCanvasProps) {
  const { screenToFlowPosition, fitView } = useReactFlow();
  const importRef = useContext(TemplateImportContext);
  const updateMyPresence = useUpdateMyPresence();

  useEffect(() => {
    importRef.current = (template: CanvasTemplate) => {
      const removeNodes = nodes.map((n) => ({ type: "remove" as const, id: n.id }));
      const removeEdges = edges.map((e) => ({ type: "remove" as const, id: e.id }));
      const addNodes = template.nodes.map((n) => ({ type: "add" as const, item: n }));
      const addEdges = template.edges.map((e) => ({ type: "add" as const, item: e }));
      onNodesChange([...removeNodes, ...addNodes]);
      onEdgesChange([...removeEdges, ...addEdges]);
      setTimeout(() => fitView({ duration: 400 }), 50);
    };
  }, [nodes, edges, onNodesChange, onEdgesChange, fitView, importRef]);

  function handleConnect(connection: Connection) {
    if (!connection.source || !connection.target) return;
    onEdgesChange([{
      type: "add",
      item: {
        id: `e-${Date.now()}`,
        type: "canvasEdge",
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
        data: {},
      },
    }]);
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    const raw = e.dataTransfer.getData("application/ghost-shape");
    if (!raw) return;
    let payload: ShapeDragPayload;
    try {
      payload = JSON.parse(raw) as ShapeDragPayload;
    } catch {
      return;
    }
    const isFirstNode = nodes.length === 0;
    const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
    const id = `${payload.shape}-${Date.now()}-${++nodeCounter}`;
    onNodesChange([
      {
        type: "add",
        item: {
          id,
          type: "canvasNode",
          position: {
            x: position.x - payload.width / 2,
            y: position.y - payload.height / 2,
          },
          data: { label: "", shape: payload.shape },
          width: payload.width,
          height: payload.height,
        },
      },
    ]);
    if (isFirstNode) {
      setTimeout(() => fitView({ nodes: [{ id }], duration: 400, padding: 1, maxZoom: 1.5 }), 80);
    }
  }

  function handleMouseMove(e: React.MouseEvent) {
    const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
    updateMyPresence({ cursor: position });
  }

  function handleMouseLeave() {
    updateMyPresence({ cursor: null });
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      defaultEdgeOptions={defaultEdgeOptions}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={handleConnect}
      onDelete={onDelete}
      deleteKeyCode={["Backspace", "Delete"]}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      fitView
      connectionMode={ConnectionMode.Loose}
    >
      <MiniMap />
      <Background variant={BackgroundVariant.Dots} />
      <LiveCursors />
      <PresenceAvatarGroup isOwner={isOwner} projectId={projectId} />
      <ControlBar />
      <Panel position="bottom-center">
        <ShapePanel />
      </Panel>
    </ReactFlow>
  );
}

// ─── Canvas editor (inside RoomProvider) ─────────────────────────────────────

interface CanvasEditorProps {
  projectId: string;
  isOwner: boolean;
  onSaveStatusChange: (status: SaveStatus) => void;
  triggerSaveRef?: { current: (() => void) | null };
}

function CanvasEditor({ projectId, isOwner, onSaveStatusChange, triggerSaveRef }: CanvasEditorProps) {
  const { nodes, edges, onNodesChange, onEdgesChange, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      suspense: true,
      nodes: { initial: [] },
      edges: { initial: [] },
    });

  const self = useSelf();
  const [isRevoked, setIsRevoked] = useState(false);
  const [autosaveEnabled, setAutosaveEnabled] = useState(false);

  useEventListener(({ event }) => {
    if (event.type === "KICKED" && event.userId === self?.id) {
      setIsRevoked(true);
    }
  });

  // Load saved canvas state into an empty room on first mount
  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      setAutosaveEnabled(true);
      return;
    }
    fetch(`/api/projects/${projectId}/canvas`)
      .then((r) => r.ok ? r.json() : null)
      .then((data: { nodes: CanvasNode[]; edges: CanvasEdge[] } | null) => {
        if (data && data.nodes.length > 0) {
          onNodesChange(data.nodes.map((n) => ({ type: "add" as const, item: n })));
          onEdgesChange(data.edges.map((e) => ({ type: "add" as const, item: e })));
        }
      })
      .catch(() => null)
      .finally(() => setAutosaveEnabled(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { triggerSave } = useAutosave({
    projectId,
    nodes,
    edges,
    onStatusChange: onSaveStatusChange,
    enabled: autosaveEnabled,
  });

  useEffect(() => {
    if (triggerSaveRef) triggerSaveRef.current = triggerSave;
  }, [triggerSave, triggerSaveRef]);

  if (isRevoked) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-base/80 backdrop-blur-sm">
        <div className="rounded-3xl border border-border bg-elevated p-10 text-center shadow-2xl">
          <div className="mb-4 flex justify-center">
            <ShieldOff className="h-8 w-8 text-state-error" />
          </div>
          <h2 className="mb-2 text-lg font-semibold text-foreground">Access Revoked</h2>
          <p className="mb-6 text-sm text-copy-muted">Your privileges to this room have been revoked.</p>
          <a
            href="/editor"
            className="inline-flex items-center justify-center rounded-xl bg-brand px-4 py-2 text-sm font-medium text-base hover:opacity-90 transition-opacity"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <FlowActionsContext.Provider value={onNodesChange}>
      <FlowEdgesContext.Provider value={onEdgesChange}>
        <ReactFlowProvider>
          <FlowCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onDelete={onDelete}
            isOwner={isOwner}
            projectId={projectId}
          />
        </ReactFlowProvider>
      </FlowEdgesContext.Provider>
    </FlowActionsContext.Provider>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────

interface CanvasWrapperProps {
  roomId: string;
  projectId: string;
  isOwner: boolean;
  onSaveStatusChange: (status: SaveStatus) => void;
  triggerSaveRef?: { current: (() => void) | null };
}

export function CanvasWrapper({ roomId, projectId, isOwner, onSaveStatusChange, triggerSaveRef }: CanvasWrapperProps) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id={roomId}
        initialPresence={{ cursor: null, thinking: false }}
      >
        <ErrorBoundary
          fallback={
            <div className="flex h-full items-center justify-center text-sm text-copy-muted">
              Canvas connection error
            </div>
          }
        >
          <ClientSideSuspense
            fallback={
              <div className="flex h-full items-center justify-center text-sm text-copy-muted">
                Loading canvas…
              </div>
            }
          >
            <CanvasEditor
              projectId={projectId}
              isOwner={isOwner}
              onSaveStatusChange={onSaveStatusChange}
              triggerSaveRef={triggerSaveRef}
            />
          </ClientSideSuspense>
        </ErrorBoundary>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
