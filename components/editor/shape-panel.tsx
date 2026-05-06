"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Circle, Cylinder, Diamond, Hexagon, Pill, RectangleHorizontal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ShapeRenderer } from "./canvas-node";

export interface ShapeDragPayload {
  shape: string;
  width: number;
  height: number;
}

interface DragPreview extends ShapeDragPayload {
  x: number;
  y: number;
}

const SHAPES: { shape: string; icon: LucideIcon; width: number; height: number; label: string }[] = [
  { shape: "rectangle", icon: RectangleHorizontal, width: 160, height: 80,  label: "Rectangle" },
  { shape: "diamond",   icon: Diamond,             width: 120, height: 120, label: "Diamond"   },
  { shape: "circle",    icon: Circle,              width: 100, height: 100, label: "Circle"    },
  { shape: "pill",      icon: Pill,                width: 160, height: 60,  label: "Pill"      },
  { shape: "cylinder",  icon: Cylinder,            width: 100, height: 120, label: "Cylinder"  },
  { shape: "hexagon",   icon: Hexagon,             width: 120, height: 120, label: "Hexagon"   },
];

export function ShapePanel() {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<DragPreview | null>(null);

  useEffect(() => {
    if (!isDragging) return;
    let rafId = 0;
    function onDragOver(e: DragEvent) {
      cancelAnimationFrame(rafId);
      const x = e.clientX;
      const y = e.clientY;
      rafId = requestAnimationFrame(() => {
        setPreview((p) => (p ? { ...p, x, y } : null));
      });
    }
    document.addEventListener("dragover", onDragOver);
    return () => {
      document.removeEventListener("dragover", onDragOver);
      cancelAnimationFrame(rafId);
    };
  }, [isDragging]);

  function handleDragStart(e: React.DragEvent, config: (typeof SHAPES)[number]) {
    const payload: ShapeDragPayload = {
      shape: config.shape,
      width: config.width,
      height: config.height,
    };
    e.dataTransfer.setData("application/ghost-shape", JSON.stringify(payload));
    e.dataTransfer.effectAllowed = "copy";

    // Suppress native drag image so only our preview shows
    const blank = new Image();
    blank.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    e.dataTransfer.setDragImage(blank, 0, 0);

    setPreview({ ...payload, x: e.clientX, y: e.clientY });
    setIsDragging(true);
  }

  function handleDragEnd() {
    setIsDragging(false);
    setPreview(null);
  }

  return (
    <>
      <div className="flex items-center gap-1 rounded-full border border-border bg-elevated px-3 py-2 shadow-lg">
        {SHAPES.map((config) => {
          const Icon = config.icon;
          return (
            <button
              key={config.shape}
              draggable
              onDragStart={(e) => handleDragStart(e, config)}
              onDragEnd={handleDragEnd}
              title={config.label}
              className="flex h-8 w-8 cursor-grab items-center justify-center rounded-full text-copy-muted transition-colors hover:bg-muted hover:text-foreground active:cursor-grabbing"
            >
              <Icon size={16} />
            </button>
          );
        })}
      </div>
      {preview &&
        createPortal(
          <div
            style={{
              position: "fixed",
              left: preview.x - preview.width / 2,
              top: preview.y - preview.height / 2,
              width: preview.width,
              height: preview.height,
              pointerEvents: "none",
              opacity: 0.65,
              zIndex: 9999,
            }}
          >
            <ShapeRenderer shape={preview.shape} />
          </div>,
          document.body
        )}
    </>
  );
}
