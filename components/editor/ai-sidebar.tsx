"use client"

import { KeyboardEvent, useRef, useState } from "react"
import { Bot, Download, FileText, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface AiSidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

const STARTER_CHIPS = [
  "Design an e-commerce backend",
  "Create a chat app architecture",
  "Build a CI/CD pipeline",
]

export function AiSidebar({ isOpen, onClose }: AiSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const chatEndRef = useRef<HTMLDivElement>(null)

  function handleSend() {
    const trimmed = input.trim()
    if (!trimmed) return
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-user`, role: "user", content: trimmed },
    ])
    setInput("")
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleChip(chip: string) {
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-chip`, role: "user", content: chip },
    ])
  }

  return (
    <aside
      className={cn(
        "fixed top-12 right-0 bottom-0 z-40 flex w-80 flex-col",
        "border-l border-border bg-base/95 shadow-2xl backdrop-blur-sm",
        "transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      {/* Header */}
      <div className="flex shrink-0 items-start justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Bot className="h-5 w-5 shrink-0 text-accent-foreground" />
          <div>
            <p className="text-sm font-semibold text-foreground">AI Workspace</p>
            <p className="text-xs text-copy-muted">Collaborate with Ghost AI</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-7 w-7 shrink-0 text-copy-muted hover:text-foreground"
          aria-label="Close AI sidebar"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="architect" className="flex flex-1 flex-col gap-0 overflow-hidden">
        <div className="shrink-0 px-4 pb-0 pt-3">
          <TabsList className="w-full">
            <TabsTrigger
              value="architect"
              className="flex-1 text-copy-muted dark:data-active:!bg-accent dark:data-active:!text-accent-foreground"
            >
              AI Architect
            </TabsTrigger>
            <TabsTrigger
              value="specs"
              className="flex-1 text-copy-muted dark:data-active:!bg-accent dark:data-active:!text-accent-foreground"
            >
              Specs
            </TabsTrigger>
          </TabsList>
        </div>

        {/* AI Architect Tab */}
        <TabsContent
          value="architect"
          className="flex flex-1 flex-col overflow-hidden px-4 pb-4 pt-3"
        >
          {/* Chat area */}
          <div className="flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center gap-4 pb-2 pt-8">
                <Bot className="h-10 w-10 text-copy-muted" />
                <p className="px-2 text-center text-sm text-copy-muted">
                  Describe what you want to build and Ghost AI will help you design it.
                </p>
                <div className="flex w-full flex-col gap-2">
                  {STARTER_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleChip(chip)}
                      className="rounded-full bg-subtle px-3 py-1.5 text-left text-sm text-accent-foreground transition-colors hover:opacity-80"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 py-2">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "max-w-[85%] rounded-xl px-3 py-2 text-sm",
                      msg.role === "user"
                        ? "ml-auto bg-brand-dim border-2 border-brand/50 text-copy-primary"
                        : "mr-auto bg-elevated border border-border text-accent-foreground"
                    )}
                  >
                    {msg.content}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="mt-3 shrink-0 rounded-xl border border-border bg-elevated p-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Ghost AI…"
              rows={3}
              className={cn(
                "w-full resize-none bg-transparent text-sm text-foreground outline-none",
                "placeholder:text-copy-muted",
                "min-h-[72px] max-h-[160px]",
                "overflow-y-auto"
              )}
              style={{ fieldSizing: "content" } as React.CSSProperties}
            />
            <div className="flex justify-end pt-1.5">
              <Button
                size="sm"
                onClick={handleSend}
                disabled={!input.trim()}
                className="h-7 bg-primary px-3 text-xs text-primary-foreground hover:bg-primary/90"
              >
                Send
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Specs Tab */}
        <TabsContent
          value="specs"
          className="flex flex-1 flex-col overflow-hidden px-4 pb-4 pt-3"
        >
          <Button className="mb-4 w-full bg-primary text-primary-foreground hover:bg-primary/90">
            Generate Spec
          </Button>
          <div className="flex items-start gap-3 rounded-xl border border-border bg-elevated p-4">
            <FileText className="mt-0.5 h-5 w-5 shrink-0 text-copy-muted" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                E-Commerce Backend
              </p>
              <p className="mt-0.5 line-clamp-2 text-xs text-copy-muted">
                REST API with auth, product catalog, cart, and Stripe checkout integration.
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              disabled
              className="h-7 w-7 shrink-0 text-copy-faint"
              aria-label="Download spec"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </aside>
  )
}
