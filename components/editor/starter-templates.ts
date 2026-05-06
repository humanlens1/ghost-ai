import { createContext } from "react";
import type { CanvasNode, CanvasEdge } from "@/types/canvas";
import { NODE_COLORS } from "@/types/canvas";

export interface CanvasTemplate {
  id: string;
  name: string;
  description: string;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}

export type ImportFn = (template: CanvasTemplate) => void;
export const TemplateImportContext = createContext<{ current: ImportFn | null }>({ current: null });

const [dark, blue, purple, orange, red, , green, teal] = NODE_COLORS;

function n(
  id: string, label: string, x: number, y: number,
  shape: string, color: { fill: string; text: string },
): CanvasNode {
  return {
    id, type: "canvasNode",
    position: { x, y },
    data: { label, shape, color: color.fill, textColor: color.text },
    width: 140, height: 56,
  };
}

function e(id: string, source: string, target: string, label?: string): CanvasEdge {
  return { id, type: "canvasEdge", source, target, data: label ? { label } : {} };
}

export const CANVAS_TEMPLATES: CanvasTemplate[] = [
  {
    id: "microservices",
    name: "Microservices",
    description: "API Gateway routes traffic to isolated services, each backed by a dedicated database and connected via a shared message bus.",
    nodes: [
      n("ms-client",   "Client",           200,   0, "rectangle", blue),
      n("ms-gateway",  "API Gateway",      200, 120, "rectangle", teal),
      n("ms-auth",     "Auth Service",       0, 260, "rectangle", purple),
      n("ms-orders",   "Orders Service",   160, 260, "rectangle", orange),
      n("ms-products", "Products Service", 340, 260, "rectangle", green),
      n("ms-bus",      "Message Bus",      170, 400, "pill",      dark),
      n("ms-db-ord",   "Orders DB",        160, 520, "cylinder",  orange),
      n("ms-db-prod",  "Products DB",      340, 520, "cylinder",  green),
    ],
    edges: [
      e("e-cl-gw", "ms-client",   "ms-gateway"),
      e("e-gw-au", "ms-gateway",  "ms-auth"),
      e("e-gw-or", "ms-gateway",  "ms-orders"),
      e("e-gw-pr", "ms-gateway",  "ms-products"),
      e("e-or-bu", "ms-orders",   "ms-bus"),
      e("e-pr-bu", "ms-products", "ms-bus"),
      e("e-or-db", "ms-orders",   "ms-db-ord"),
      e("e-pr-db", "ms-products", "ms-db-prod"),
    ],
  },
  {
    id: "ci-cd",
    name: "CI/CD Pipeline",
    description: "End-to-end delivery from source commit through build, test, containerisation, and staged deployment to production.",
    nodes: [
      n("ci-code",  "Code Commit",       0, 100, "rectangle", blue),
      n("ci-trig",  "CI Trigger",      180, 100, "diamond",   dark),
      n("ci-build", "Build",           360,   0, "rectangle", orange),
      n("ci-test",  "Test Suite",      360, 120, "rectangle", purple),
      n("ci-sec",   "Security Scan",   360, 240, "rectangle", red),
      n("ci-art",   "Artifact Store",  540, 120, "cylinder",  teal),
      n("ci-stag",  "Deploy: Staging", 720,  60, "rectangle", green),
      n("ci-prod",  "Deploy: Prod",    720, 200, "rectangle", green),
    ],
    edges: [
      e("e-cd-tr", "ci-code",  "ci-trig"),
      e("e-tr-bu", "ci-trig",  "ci-build"),
      e("e-tr-te", "ci-trig",  "ci-test"),
      e("e-tr-se", "ci-trig",  "ci-sec"),
      e("e-bu-ar", "ci-build", "ci-art"),
      e("e-te-ar", "ci-test",  "ci-art"),
      e("e-se-ar", "ci-sec",   "ci-art"),
      e("e-ar-st", "ci-art",   "ci-stag"),
      e("e-st-pr", "ci-stag",  "ci-prod", "manual gate"),
    ],
  },
  {
    id: "event-driven",
    name: "Event-Driven System",
    description: "Producers publish events to a central bus. Independent consumers handle emails, push notifications, analytics, and error queues.",
    nodes: [
      n("ev-pa", "Producer A",   0,  60, "rectangle", blue),
      n("ev-pb", "Producer B",   0, 180, "rectangle", blue),
      n("ev-br", "Event Broker", 200, 120, "hexagon",  dark),
      n("ev-cx", "Consumer X",  420,   0, "rectangle", green),
      n("ev-cy", "Consumer Y",  420, 120, "rectangle", teal),
      n("ev-cz", "Consumer Z",  420, 240, "rectangle", purple),
      n("ev-st", "Event Store", 200, 300, "cylinder",  orange),
    ],
    edges: [
      e("e-pa-br", "ev-pa", "ev-br"),
      e("e-pb-br", "ev-pb", "ev-br"),
      e("e-br-cx", "ev-br", "ev-cx"),
      e("e-br-cy", "ev-br", "ev-cy"),
      e("e-br-cz", "ev-br", "ev-cz"),
      e("e-br-st", "ev-br", "ev-st"),
    ],
  },
];
