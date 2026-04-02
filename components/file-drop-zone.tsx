"use client"

import { cn } from "@/lib/utils"
import { FileUp } from "lucide-react"
import { useCallback, useRef, useState } from "react"

interface FileDropZoneProps {
  onFileContent: (content: string) => void
}

export function FileDropZone({ onFileContent }: FileDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const readFile = useCallback(
    (file: File) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === "string") {
          onFileContent(reader.result)
        }
      }
      reader.readAsText(file)
    },
    [onFileContent],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) readFile(file)
    },
    [readFile],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) readFile(file)
    },
    [readFile],
  )

  return (
    <div
      className={cn(
        "flex flex-1 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed m-4 transition-colors",
        isDragOver
          ? "border-primary bg-primary/5"
          : "border-border hover:border-muted-foreground/50",
      )}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragOver(true)
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <FileUp className="size-8 text-muted-foreground" />
      <div className="text-center text-sm">
        <p className="font-medium text-foreground">Drop a JSON file here</p>
        <p className="mt-1 text-muted-foreground">or click to browse</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".json,application/json,.txt"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  )
}
