"use client";

import { Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CANVAS_TEMPLATES, type CanvasTemplate } from "./starter-templates";

interface StarterTemplatesModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (template: CanvasTemplate) => void;
}

const VB_W = 480;
const VB_H = 260;
const VB_PAD = 20;

function ShapePreview({
  x, y, w, h, fill, shape,
}: {
  x: number; y: number; w: number; h: number;
  fill: string; shape: string;
}) {
  const cx = x + w / 2;
  const cy = y + h / 2;

  switch (shape) {
    case "circle":
      return <ellipse cx={cx} cy={cy} rx={w / 2} ry={h / 2} fill={fill} />;

    case "diamond": {
      const pts = `${cx},${y} ${x + w},${cy} ${cx},${y + h} ${x},${cy}`;
      return <polygon points={pts} fill={fill} />;
    }

    case "hexagon": {
      const qw = w / 4;
      const pts = [
        `${x + qw},${y}`,
        `${x + qw * 3},${y}`,
        `${x + w},${cy}`,
        `${x + qw * 3},${y + h}`,
        `${x + qw},${y + h}`,
        `${x},${cy}`,
      ].join(" ");
      return <polygon points={pts} fill={fill} />;
    }

    case "pill":
      return <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={fill} />;

    case "cylinder":
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} rx={3} fill={fill} />
          <ellipse
            cx={cx} cy={y}
            rx={w / 2} ry={Math.max(2, h * 0.12)}
            fill={fill}
            style={{ filter: "brightness(1.3)" }}
          />
        </g>
      );

    default:
      return <rect x={x} y={y} width={w} height={h} rx={3} fill={fill} />;
  }
}

function TemplatePreview({ template }: { template: CanvasTemplate }) {
  if (!template.nodes.length) return null;

  const minX = Math.min(...template.nodes.map((n) => n.position.x));
  const minY = Math.min(...template.nodes.map((n) => n.position.y));
  const maxX = Math.max(...template.nodes.map((n) => n.position.x + (n.width ?? 140)));
  const maxY = Math.max(...template.nodes.map((n) => n.position.y + (n.height ?? 56)));

  const contentW = maxX - minX || 1;
  const contentH = maxY - minY || 1;

  const scaleX = (VB_W - VB_PAD * 2) / contentW;
  const scaleY = (VB_H - VB_PAD * 2) / contentH;
  const scale = Math.min(scaleX, scaleY);

  const scaledW = contentW * scale;
  const scaledH = contentH * scale;
  const offsetX = VB_PAD + ((VB_W - VB_PAD * 2) - scaledW) / 2;
  const offsetY = VB_PAD + ((VB_H - VB_PAD * 2) - scaledH) / 2;

  function tx(x: number) { return offsetX + (x - minX) * scale; }
  function ty(y: number) { return offsetY + (y - minY) * scale; }

  const nodeMap = new Map(template.nodes.map((n) => [n.id, n]));

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      width="100%"
      style={{ display: "block", background: "#0a0a0a" }}
    >
      {template.edges.map((edge) => {
        const src = nodeMap.get(edge.source);
        const tgt = nodeMap.get(edge.target);
        if (!src || !tgt) return null;
        const sw = (src.width ?? 140) * scale;
        const sh = (src.height ?? 56) * scale;
        const tw = (tgt.width ?? 140) * scale;
        const th = (tgt.height ?? 56) * scale;
        return (
          <line
            key={edge.id}
            x1={tx(src.position.x) + sw / 2}
            y1={ty(src.position.y) + sh / 2}
            x2={tx(tgt.position.x) + tw / 2}
            y2={ty(tgt.position.y) + th / 2}
            stroke="#3a3a3a"
            strokeWidth={2}
          />
        );
      })}
      {template.nodes.map((n) => {
        const w = (n.width ?? 140) * scale;
        const h = (n.height ?? 56) * scale;
        return (
          <ShapePreview
            key={n.id}
            x={tx(n.position.x)}
            y={ty(n.position.y)}
            w={w}
            h={h}
            fill={n.data.color ?? "#1F1F1F"}
            shape={n.data.shape ?? "rectangle"}
          />
        );
      })}
    </svg>
  );
}

export function StarterTemplatesModal({
  open,
  onClose,
  onImport,
}: StarterTemplatesModalProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[72vw] sm:w-[72vw]">
        <DialogHeader className="gap-2">
          <DialogTitle className="text-2xl font-bold">Import Template</DialogTitle>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
            Choose a starter template to pre-populate your canvas. Any existing nodes will be
            replaced — use{" "}
            <kbd className="inline-flex items-center rounded border border-white/20 bg-white/10 px-1.5 py-0.5 font-mono text-xs" style={{ color: "rgba(255,255,255,0.75)" }}>
              ⌘Z
            </kbd>{" "}
            to undo.
          </p>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4">
          {CANVAS_TEMPLATES.map((template) => (
            <div
              key={template.id}
              className="flex flex-col rounded-xl overflow-hidden border border-border bg-background"
            >
              <TemplatePreview template={template} />
              <div className="flex flex-col gap-4 p-5">
                <div className="flex flex-col gap-1.5">
                  <p className="text-base font-bold text-foreground">{template.name}</p>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {template.description}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => onImport(template)}
                >
                  <Download className="h-4 w-4" />
                  Import
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
