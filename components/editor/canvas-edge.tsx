"use client";

import { createContext, useContext, useState } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  useReactFlow,
  type EdgeProps,
  type OnEdgesChange,
} from "@xyflow/react";
import type { CanvasNode, CanvasEdge } from "@/types/canvas";

export const FlowEdgesContext = createContext<OnEdgesChange<CanvasEdge> | null>(null);

export function CanvasEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
  markerEnd,
  style,
}: EdgeProps<CanvasEdge>) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const onEdgesChange = useContext(FlowEdgesContext);
  const { getEdge } = useReactFlow<CanvasNode, CanvasEdge>();

  const label = data?.label ?? "";
  const isActive = selected || hovered;

  function commitLabel() {
    const edge = getEdge(id);
    if (edge && onEdgesChange) {
      onEdgesChange([{
        type: "replace",
        id,
        item: { ...edge, data: { ...edge.data, label: draft } },
      }]);
    }
    setEditing(false);
  }

  function startEditing(e: React.MouseEvent) {
    e.stopPropagation();
    setDraft(label);
    setEditing(true);
  }

  return (
    <>
      <g
        style={{ opacity: isActive ? 1 : 0.45, transition: "opacity 0.15s" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onDoubleClick={startEditing}
      >
        {/* wider invisible hit target */}
        <path
          d={edgePath}
          fill="none"
          stroke="black"
          strokeOpacity={0}
          strokeWidth={20}
          style={{ pointerEvents: "stroke" }}
        />
        <BaseEdge
          id={id}
          path={edgePath}
          markerEnd={markerEnd}
          interactionWidth={0}
          style={{ strokeLinecap: "round", strokeWidth: 1.5, ...style }}
        />
      </g>
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onDoubleClick={startEditing}
        >
          {editing ? (
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitLabel}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "Escape") {
                  e.preventDefault();
                  commitLabel();
                }
                e.stopPropagation();
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              className="rounded bg-elevated px-2 py-0.5 text-sm text-copy outline-none"
              style={{ width: `${Math.max(draft.length, 6)}ch`, minWidth: "6ch" }}
            />
          ) : label ? (
            <span className="cursor-text rounded-full border border-border bg-elevated px-2 py-0.5 text-xs text-copy">
              {label}
            </span>
          ) : isActive ? (
            <span className="pointer-events-none cursor-text text-xs text-copy-muted opacity-40">
              label
            </span>
          ) : null}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
