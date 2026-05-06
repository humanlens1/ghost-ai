"use client";

import { useContext, useEffect } from "react";
import { LiveblocksProvider, RoomProvider, ClientSideSuspense, useUndo, useRedo, useCanUndo, useCanRedo } from "@liveblocks/react";
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
import { useLiveblocksFlow, Cursors } from "@liveblocks/react-flow";
import { Minus, Plus, Maximize2, Undo2, Redo2 } from "lucide-react";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
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

function ControlBar() {
  const flow = useReactFlow();
  const undo = useUndo();
  const redo = useRedo();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  useKeyboardShortcuts(flow, undo, redo);

  const btnClass =
    "flex items-center justify-center w-7 h-7 rounded-full text-copy-muted hover:text-copy hover:bg-fill transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

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

interface FlowCanvasProps {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  onNodesChange: OnNodesChange<CanvasNode>;
  onEdgesChange: OnEdgesChange<CanvasEdge>;
  onDelete: OnDelete<CanvasNode, CanvasEdge>;
}

function FlowCanvas({ nodes, edges, onNodesChange, onEdgesChange, onDelete }: FlowCanvasProps) {
  const { screenToFlowPosition, fitView } = useReactFlow();
  const importRef = useContext(TemplateImportContext);

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

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const raw = e.dataTransfer.getData("application/ghost-shape");
    if (!raw) return;
    let payload: ShapeDragPayload;
    try {
      payload = JSON.parse(raw) as ShapeDragPayload;
    } catch {
      return;
    }
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
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      fitView
      connectionMode={ConnectionMode.Loose}
    >
      <MiniMap />
      <Background variant={BackgroundVariant.Dots} />
      <Cursors />
      <ControlBar />
      <Panel position="bottom-center">
        <ShapePanel />
      </Panel>
    </ReactFlow>
  );
}

function CanvasEditor() {
  const { nodes, edges, onNodesChange, onEdgesChange, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      suspense: true,
      nodes: { initial: [] },
      edges: { initial: [] },
    });

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
          />
        </ReactFlowProvider>
      </FlowEdgesContext.Provider>
    </FlowActionsContext.Provider>
  );
}

interface CanvasWrapperProps {
  roomId: string;
}

export function CanvasWrapper({ roomId }: CanvasWrapperProps) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id={roomId}
        initialPresence={{ cursor: null, isThinking: false }}
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
            <CanvasEditor />
          </ClientSideSuspense>
        </ErrorBoundary>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
