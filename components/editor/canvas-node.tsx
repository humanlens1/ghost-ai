"use client";

import { createContext, useContext, useState } from "react";
import {
  Handle,
  NodeResizer,
  Position,
  useReactFlow,
  type NodeProps,
  type OnNodesChange,
} from "@xyflow/react";
import { NODE_COLORS, type CanvasNode, type CanvasEdge, type NodeColor } from "@/types/canvas";

export const FlowActionsContext = createContext<OnNodesChange<CanvasNode> | null>(null);

const SVG_SHAPES = new Set(["diamond", "hexagon", "cylinder"]);

interface ShapeRendererProps {
  shape: string;
  selected?: boolean;
  bgColor?: string;
}

export function ShapeRenderer({ shape, selected, bgColor }: ShapeRendererProps) {
  const stroke = selected ? "var(--color-primary)" : "var(--color-border)";
  const fill = bgColor ?? "var(--color-elevated)";

  if (shape === "diamond") {
    return (
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polygon points="50,3 97,50 50,97 3,50" fill={fill} stroke={stroke} strokeWidth="2" />
      </svg>
    );
  }

  if (shape === "hexagon") {
    return (
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polygon
          points="50,3 93,26.5 93,73.5 50,97 7,73.5 7,26.5"
          fill={fill}
          stroke={stroke}
          strokeWidth="2"
        />
      </svg>
    );
  }

  if (shape === "cylinder") {
    return (
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d="M 5,20 L 5,80 A 45,12 0 0,0 95,80 L 95,20 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <ellipse cx="50" cy="20" rx="45" ry="12" fill={fill} stroke={stroke} strokeWidth="2" />
      </svg>
    );
  }

  const radius = shape === "circle" || shape === "pill" ? "9999px" : "4px";
  const borderClass = selected ? "border-primary" : "border-border";

  return (
    <div
      className={`h-full w-full border ${borderClass}`}
      style={{ borderRadius: radius, backgroundColor: fill }}
    />
  );
}

function SwatchButton({
  color,
  isActive,
  onSelect,
}: {
  color: NodeColor;
  isActive: boolean;
  onSelect: (color: NodeColor) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      style={{
        backgroundColor: color.fill,
        width: 16,
        height: 16,
        borderRadius: "50%",
        flexShrink: 0,
        outline: isActive ? "2px solid rgba(255,255,255,0.6)" : "none",
        outlineOffset: "2px",
        boxShadow: hovered ? `0 0 5px 2px ${color.text}50` : undefined,
        transition: "box-shadow 0.1s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(color);
      }}
    />
  );
}

function NodeColorToolbar({
  activeColor,
  onSelect,
}: {
  activeColor: string;
  onSelect: (color: NodeColor) => void;
}) {
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full border border-border bg-elevated px-2.5 py-1.5 shadow-lg"
      style={{ bottom: "calc(100% + 8px)", zIndex: 10 }}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {NODE_COLORS.map((nc) => (
        <SwatchButton
          key={nc.fill}
          color={nc}
          isActive={activeColor === nc.fill}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

export function CanvasNodeComponent({ id, data, selected }: NodeProps<CanvasNode>) {
  const shape = data.shape ?? "rectangle";
  const bgColor = data.color ?? NODE_COLORS[0].fill;
  const textColor = data.textColor ?? NODE_COLORS[0].text;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [nodeHovered, setNodeHovered] = useState(false);
  const onNodesChange = useContext(FlowActionsContext);
  const { getNode } = useReactFlow<CanvasNode, CanvasEdge>();

  const handleStyle: React.CSSProperties = {
    width: 8,
    height: 8,
    backgroundColor: "white",
    border: "1.5px solid #333",
    borderRadius: "50%",
    opacity: nodeHovered || selected ? 1 : 0,
    transition: "opacity 0.15s",
  };

  function commitLabel() {
    const current = getNode(id);
    if (current && onNodesChange) {
      onNodesChange([{ type: "replace", id, item: { ...current, data: { ...current.data, label: draft } } }]);
    }
    setEditing(false);
  }

  function handleDoubleClick(e: React.MouseEvent) {
    e.stopPropagation();
    setDraft(data.label ?? "");
    setEditing(true);
  }

  function handleColorSelect(nc: NodeColor) {
    const current = getNode(id);
    if (current && onNodesChange) {
      onNodesChange([{
        type: "replace",
        id,
        item: { ...current, data: { ...current.data, color: nc.fill, textColor: nc.text } },
      }]);
    }
  }

  return (
    <div
      className="relative h-full w-full"
      onMouseEnter={() => setNodeHovered(true)}
      onMouseLeave={() => setNodeHovered(false)}
    >
      {selected && (
        <NodeColorToolbar activeColor={bgColor} onSelect={handleColorSelect} />
      )}
      <NodeResizer
        isVisible={selected}
        minWidth={60}
        minHeight={40}
        handleStyle={{
          width: 8,
          height: 8,
          borderRadius: 2,
          borderColor: "var(--color-border)",
          backgroundColor: "var(--color-elevated)",
        }}
        lineStyle={{ borderColor: "var(--color-border)" }}
      />
      <Handle id="top" type="target" position={Position.Top} style={handleStyle} />
      <Handle id="right" type="source" position={Position.Right} style={handleStyle} />
      <Handle id="bottom" type="source" position={Position.Bottom} style={handleStyle} />
      <Handle id="left" type="target" position={Position.Left} style={handleStyle} />
      <ShapeRenderer shape={shape} selected={selected} bgColor={bgColor} />
      {editing ? (
        <div className="absolute inset-0 flex items-center justify-center px-2">
          <textarea
            className="w-full resize-none bg-transparent text-center text-sm outline-none"
            style={{ border: "none", padding: 0, color: textColor }}
            value={draft}
            placeholder="Label"
            rows={1}
            autoFocus
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitLabel}
            onKeyDown={(e) => { if (e.key === "Escape") commitLabel(); }}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          />
        </div>
      ) : (
        <div
          className={`absolute inset-0 flex cursor-text items-center justify-center text-sm ${SVG_SHAPES.has(shape) ? "px-2" : "px-3"}`}
          onDoubleClick={handleDoubleClick}
        >
          <span
            className="truncate"
            style={{ color: data.label ? textColor : "var(--color-copy-muted)" }}
          >
            {data.label || "Label"}
          </span>
        </div>
      )}
    </div>
  );
}
