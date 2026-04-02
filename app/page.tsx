"use client"

import {
  EditorToolbar,
  type InputTab,
} from "@/components/editor-toolbar"
import { FileDropZone } from "@/components/file-drop-zone"
import {
  JsonEditor,
  type JsonEditorHandle,
} from "@/components/json-editor"
import {
  JsonViewer,
  type JsonValue,
} from "@/components/json-viewer"
import { Button } from "@/components/ui/button"
import { UrlLoader } from "@/components/url-loader"
import { useJsonParser } from "@/hooks/use-json-parser"
import { useResize } from "@/hooks/use-resize"
import { Moon, Sun } from "lucide-react"
import Image from "next/image"
import { useTheme } from "next-themes"
import { useCallback, useEffect, useRef, useState } from "react"

const SAMPLE_JSON = JSON.stringify(
  {
    name: "JSON Viewer",
    version: "1.0.0",
    features: ["syntax highlighting", "tree view", "search", "format"],
    config: {
      theme: "auto",
      maxDepth: 10,
      expandDefault: 2,
    },
    stats: {
      users: 1024,
      active: true,
      rating: 4.8,
    },
  },
  null,
  2,
)

export default function Page() {
  const { setTheme, resolvedTheme } = useTheme()
  const { leftWidth, onMouseDown } = useResize()
  const { parsedData, error, parse } = useJsonParser()

  const [jsonText, setJsonText] = useState("")
  const [activeTab, setActiveTab] = useState<InputTab>("edit")
  const editorRef = useRef<JsonEditorHandle>(null)

  const isDark = resolvedTheme === "dark"
  const isValidJson = parsedData !== null && error === null
  const hasContent = jsonText.trim().length > 0

  const handleEditorChange = useCallback(
    (text: string) => {
      setJsonText(text)
      if (text.trim()) {
        parse(text)
      }
    },
    [parse],
  )

  const setEditorContent = useCallback(
    (content: string) => {
      setJsonText(content)
      editorRef.current?.setValue(content)
      setActiveTab("edit")
      if (content.trim()) {
        parse(content)
      }
    },
    [parse],
  )

  const handleFormat = useCallback(() => {
    if (!parsedData) return
    const formatted = JSON.stringify(parsedData, null, 2)
    setJsonText(formatted)
    editorRef.current?.setValue(formatted)
  }, [parsedData])

  const handleMinify = useCallback(() => {
    if (!parsedData) return
    const minified = JSON.stringify(parsedData)
    setJsonText(minified)
    editorRef.current?.setValue(minified)
  }, [parsedData])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(jsonText)
  }, [jsonText])

  const handleDownload = useCallback(() => {
    const blob = new Blob([jsonText], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "data.json"
    a.click()
    URL.revokeObjectURL(url)
  }, [jsonText])

  const handleLoadSample = useCallback(() => {
    setEditorContent(SAMPLE_JSON)
  }, [setEditorContent])

  useEffect(() => {
    if (jsonText.trim()) {
      parse(jsonText)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on mount
  }, [])

  const editorError =
    error && hasContent
      ? { message: error }
      : null

  return (
    <div className="flex h-svh flex-col">
      <header className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="JSON Viewer" width={24} height={24} className="rounded" />
          <h1 className="text-sm font-semibold">JSON Viewer</h1>
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() =>
            setTheme(resolvedTheme === "dark" ? "light" : "dark")
          }
          aria-label="Toggle theme"
          suppressHydrationWarning
        >
          {isDark ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        <div
          style={{ width: `${leftWidth}%` }}
          className="flex min-w-0 flex-col overflow-hidden"
        >
          <EditorToolbar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onFormat={handleFormat}
            onMinify={handleMinify}
            onCopy={handleCopy}
            onDownload={handleDownload}
            isValidJson={isValidJson}
            hasContent={hasContent}
          />

          {activeTab === "edit" && (
            <div className="min-h-0 flex-1 overflow-hidden">
              <JsonEditor
                ref={editorRef}
                value={jsonText}
                onChange={handleEditorChange}
                error={editorError}
                isDark={isDark}
              />
            </div>
          )}

          {activeTab === "file" && (
            <FileDropZone onFileContent={setEditorContent} />
          )}

          {activeTab === "url" && (
            <UrlLoader onContent={setEditorContent} />
          )}
        </div>

        {/* Resizer */}
        <div
          role="separator"
          aria-orientation="vertical"
          onMouseDown={onMouseDown}
          className="w-1 shrink-0 cursor-col-resize bg-border transition-colors hover:bg-primary/50"
        />

        {/* Right panel */}
        <div className="min-w-0 flex-1 overflow-auto">
          {parsedData !== null ? (
            <JsonViewer
              data={parsedData as JsonValue}
              defaultExpanded={2}
              className="h-full rounded-none border-0 shadow-none"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-muted-foreground">
              <Image src="/logo.svg" alt="" width={48} height={48} className="rounded-lg opacity-50" />
              <div className="text-center">
                <p className="text-sm font-medium">
                  Enter or paste JSON in the left panel
                </p>
                <p className="mt-1 text-xs">
                  Supports text editing, file drag-and-drop, and URL loading
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadSample}
              >
                Load Sample
              </Button>
            </div>
          )}

          {error && hasContent && parsedData !== null && (
            <div className="absolute bottom-0 left-0 right-0 border-t bg-destructive/10 px-4 py-2 text-xs text-destructive">
              JSON parse error: {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
