"use client";

import { useEffect, useRef, useCallback } from "react";
import type { CanvasNode, CanvasEdge } from "@/types/canvas";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface UseAutosaveOptions {
  projectId: string;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  onStatusChange: (status: SaveStatus) => void;
  debounceMs?: number;
  enabled?: boolean;
}

export function useAutosave({
  projectId,
  nodes,
  edges,
  onStatusChange,
  debounceMs = 1500,
  enabled = true,
}: UseAutosaveOptions): { triggerSave: () => void } {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasInitializedRef = useRef(false);
  // Always-current refs so triggerSave doesn't depend on nodes/edges identity
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  useEffect(() => { nodesRef.current = nodes; }, [nodes]);
  useEffect(() => { edgesRef.current = edges; }, [edges]);

  // Reset the guard on every mount so React StrictMode's double-invoke doesn't
  // carry a stale `true` into the second mount and trigger a spurious save.
  useEffect(() => {
    hasInitializedRef.current = false;
  }, []);

  const save = useCallback(
    async (currentNodes: CanvasNode[], currentEdges: CanvasEdge[]) => {
      onStatusChange("saving");
      try {
        const res = await fetch(`/api/projects/${projectId}/canvas`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nodes: currentNodes, edges: currentEdges }),
        });
        if (!res.ok) throw new Error("Save failed");
        onStatusChange("saved");
      } catch {
        onStatusChange("error");
      }
    },
    [projectId, onStatusChange]
  );

  const triggerSave = useCallback(() => {
    if (!enabled) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    save(nodesRef.current, edgesRef.current);
  }, [enabled, save]);

  useEffect(() => {
    if (!enabled) {
      hasInitializedRef.current = false;
      return;
    }

    // First time enabled after mount — mark ready but skip save; no user change yet
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      save(nodes, edges);
    }, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [nodes, edges, save, debounceMs, enabled]);

  return { triggerSave };
}
