"use client"

import { Button } from "@/components/ui/button"
import { Globe, Loader2 } from "lucide-react"
import { useCallback, useState } from "react"

interface UrlLoaderProps {
  onContent: (content: string) => void
}

export function UrlLoader({ onContent }: UrlLoaderProps) {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLoad = useCallback(async () => {
    if (!url.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(url.trim())
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      const text = await response.text()
      onContent(text)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load"
      setError(
        message.includes("Failed to fetch")
          ? "Request failed, possibly due to CORS restrictions or a network error"
          : message,
      )
    } finally {
      setIsLoading(false)
    }
  }, [url, onContent])

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
      <Globe className="size-8 text-muted-foreground" />
      <p className="text-sm font-medium">Load JSON from URL</p>

      <div className="flex w-full max-w-md items-stretch gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleLoad()
          }}
          placeholder="https://api.example.com/data.json"
          className="h-9 flex-1 rounded-md border bg-transparent px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <Button
          onClick={handleLoad}
          disabled={isLoading || !url.trim()}
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Load"
          )}
        </Button>
      </div>

      {error && (
        <p className="max-w-md text-center text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
