import { useCallback, useEffect, useRef, useState } from 'react'

type WorkerResult =
  | { ok: true; data: unknown }
  | { ok: false; error: string }

export function useJsonParser(): {
  parsedData: unknown | null
  error: string | null
  isLoading: boolean
  parse: (text: string) => void
} {
  const [parsedData, setParsedData] = useState<unknown | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const workerRef = useRef<Worker | null>(null)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const worker = new Worker(
      new URL('../lib/json-worker.ts', import.meta.url),
    )
    workerRef.current = worker

    worker.onmessage = (e: MessageEvent<WorkerResult>) => {
      const result = e.data
      setIsLoading(false)
      if (result.ok) {
        setParsedData(result.data)
        setError(null)
      } else {
        setError(result.error)
      }
    }

    return () => {
      if (debounceTimerRef.current !== null) {
        clearTimeout(debounceTimerRef.current)
        debounceTimerRef.current = null
      }
      worker.terminate()
      workerRef.current = null
    }
  }, [])

  const parse = useCallback((text: string) => {
    if (debounceTimerRef.current !== null) {
      clearTimeout(debounceTimerRef.current)
    }
    debounceTimerRef.current = setTimeout(() => {
      debounceTimerRef.current = null
      const w = workerRef.current
      if (!w) {
        return
      }
      setIsLoading(true)
      w.postMessage(text)
    }, 300)
  }, [])

  return { parsedData, error, isLoading, parse }
}
