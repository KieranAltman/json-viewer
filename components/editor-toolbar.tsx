"use client"

import { cn } from "@/lib/utils"
import {
  Braces,
  Check,
  Copy,
  Download,
  FileCode,
  Globe,
  Keyboard,
  Minimize2,
} from "lucide-react"
import { useCallback, useState } from "react"

export type InputTab = "edit" | "file" | "url"

interface EditorToolbarProps {
  activeTab: InputTab
  onTabChange: (tab: InputTab) => void
  onFormat: () => void
  onMinify: () => void
  onCopy: () => void
  onDownload: () => void
  isValidJson: boolean
  hasContent: boolean
}

const tabs: { id: InputTab; label: string; icon: React.ElementType }[] = [
  { id: "edit", label: "编辑", icon: Keyboard },
  { id: "file", label: "文件", icon: FileCode },
  { id: "url", label: "URL", icon: Globe },
]

export function EditorToolbar({
  activeTab,
  onTabChange,
  onFormat,
  onMinify,
  onCopy,
  onDownload,
  isValidJson,
  hasContent,
}: EditorToolbarProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    onCopy()
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [onCopy])

  return (
    <div className="flex items-center justify-between border-b px-2 py-1">
      <div className="flex items-center gap-0.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              activeTab === tab.id
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
            )}
          >
            <tab.icon className="size-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={onFormat}
          disabled={!isValidJson}
          title="格式化"
          className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
        >
          <Braces className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={onMinify}
          disabled={!isValidJson}
          title="压缩"
          className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
        >
          <Minimize2 className="size-3.5" />
        </button>

        <div className="mx-1 h-4 w-px bg-border" />

        <button
          type="button"
          onClick={handleCopy}
          disabled={!hasContent}
          title="复制"
          className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
        >
          {copied ? (
            <Check className="size-3.5 text-emerald-500" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </button>
        <button
          type="button"
          onClick={onDownload}
          disabled={!hasContent}
          title="下载"
          className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
        >
          <Download className="size-3.5" />
        </button>
      </div>
    </div>
  )
}
