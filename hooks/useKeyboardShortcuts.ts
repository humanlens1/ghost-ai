import { useEffect } from "react";

interface FlowZoomControls {
  zoomIn: (options?: { duration?: number }) => void;
  zoomOut: (options?: { duration?: number }) => void;
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || target.isContentEditable;
}

export function useKeyboardShortcuts(
  flow: FlowZoomControls | null,
  undo: () => void,
  redo: () => void
) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (isEditableTarget(e.target)) return;
      const mod = e.metaKey || e.ctrlKey;

      if (mod && e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        redo();
        return;
      }
      if (mod && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
        return;
      }
      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo();
        return;
      }
      if (!mod && (e.key === "+" || e.key === "=")) {
        e.preventDefault();
        flow?.zoomIn({ duration: 200 });
        return;
      }
      if (!mod && e.key === "-") {
        e.preventDefault();
        flow?.zoomOut({ duration: 200 });
        return;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [flow, undo, redo]);
}
