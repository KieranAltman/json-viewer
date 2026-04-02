"use client"

import { json } from "@codemirror/lang-json"
import {
  lintGutter,
  setDiagnostics,
  type Diagnostic,
} from "@codemirror/lint"
import { Compartment, EditorState } from "@codemirror/state"
import { EditorView, lineNumbers } from "@codemirror/view"
import { minimalSetup } from "codemirror"
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react"

import { cn } from "@/lib/utils"

export interface JsonEditorProps {
  value: string
  onChange: (value: string) => void
  error?: { message: string; from?: number; to?: number } | null
  className?: string
  isDark?: boolean
}

export interface JsonEditorHandle {
  setValue(text: string): void
}

const lightTheme = EditorView.theme({
  "&": {
    height: "100%",
    backgroundColor: "#ffffff",
    color: "#18181b",
    fontSize: "13px",
    fontFamily: "var(--font-mono), ui-monospace, monospace",
  },
  ".cm-scroller": {
    overflow: "auto",
    fontFamily: "inherit",
  },
  ".cm-content": { paddingBlock: "12px" },
  ".cm-gutters": {
    backgroundColor: "#fafafa",
    color: "#71717a",
    border: "none",
    borderRight: "1px solid #e4e4e7",
  },
  ".cm-activeLineGutter": { backgroundColor: "transparent" },
  ".cm-activeLine": { backgroundColor: "oklch(0.97 0.001 286.375 / 0.5)" },
  ".cm-selectionBackground": {
    backgroundColor: "oklch(0.87 0.06 254.6 / 0.35) !important",
  },
  ".cm-cursor": { borderLeftColor: "#18181b" },
})

const darkTheme = EditorView.theme({
  "&": {
    height: "100%",
    backgroundColor: "#18181b",
    color: "#fafafa",
    fontSize: "13px",
    fontFamily: "var(--font-mono), ui-monospace, monospace",
  },
  ".cm-scroller": {
    overflow: "auto",
    fontFamily: "inherit",
  },
  ".cm-content": { paddingBlock: "12px" },
  ".cm-gutters": {
    backgroundColor: "#18181b",
    color: "#71717a",
    border: "none",
    borderRight: "1px solid #27272a",
  },
  ".cm-activeLineGutter": { backgroundColor: "transparent" },
  ".cm-activeLine": { backgroundColor: "oklch(0.37 0.013 285.805 / 0.45)" },
  ".cm-selectionBackground": {
    backgroundColor: "oklch(0.45 0.015 286 / 0.45) !important",
  },
  ".cm-cursor": { borderLeftColor: "#fafafa" },
})

export const JsonEditor = forwardRef<JsonEditorHandle, JsonEditorProps>(
  function JsonEditor(
    { value, onChange, error, className, isDark = false },
    ref,
  ) {
    const containerRef = useRef<HTMLDivElement>(null)
    const viewRef = useRef<EditorView | null>(null)
    const themeCompartmentRef = useRef<Compartment | null>(null)
    if (!themeCompartmentRef.current) {
      themeCompartmentRef.current = new Compartment()
    }
    const themeCompartment = themeCompartmentRef.current
    const applyingExternalRef = useRef(false)
    const onChangeRef = useRef(onChange)
    onChangeRef.current = onChange

    useImperativeHandle(ref, () => ({
      setValue(text: string) {
        const view = viewRef.current
        if (!view) return
        applyingExternalRef.current = true
        view.dispatch({
          changes: {
            from: 0,
            to: view.state.doc.length,
            insert: text,
          },
        })
        queueMicrotask(() => {
          applyingExternalRef.current = false
        })
      },
    }))

    useEffect(() => {
      const parent = containerRef.current
      if (!parent) return

      const state = EditorState.create({
        doc: value,
        extensions: [
          minimalSetup,
          json(),
          lineNumbers(),
          lintGutter(),
          EditorView.lineWrapping,
          themeCompartment.of(isDark ? darkTheme : lightTheme),
          EditorView.updateListener.of((update) => {
            if (!update.docChanged) return
            if (applyingExternalRef.current) return
            onChangeRef.current(update.state.doc.toString())
          }),
        ],
      })

      const view = new EditorView({
        state,
        parent,
      })
      viewRef.current = view

      const ro = new ResizeObserver(() => {
        view.requestMeasure()
      })
      ro.observe(parent)

      return () => {
        ro.disconnect()
        view.destroy()
        viewRef.current = null
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps -- init once; value/onChange synced elsewhere
    }, [])

    useEffect(() => {
      const view = viewRef.current
      if (!view) return
      const current = view.state.doc.toString()
      if (current === value) return
      applyingExternalRef.current = true
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: value },
      })
      queueMicrotask(() => {
        applyingExternalRef.current = false
      })
    }, [value])

    useEffect(() => {
      const view = viewRef.current
      if (!view) return
      view.dispatch({
        effects: themeCompartmentRef.current!.reconfigure(
          isDark ? darkTheme : lightTheme,
        ),
      })
    }, [isDark])

    useEffect(() => {
      const view = viewRef.current
      if (!view) return
      if (!error) {
        view.dispatch(setDiagnostics(view.state, []))
        return
      }
      const len = view.state.doc.length
      const from =
        error.from != null ? Math.min(Math.max(0, error.from), len) : 0
      const to =
        error.to != null ? Math.min(Math.max(0, error.to), len) : len
      const diagnostic: Diagnostic = {
        from,
        to: Math.max(from, to),
        message: error.message,
        severity: "error",
      }
      view.dispatch(setDiagnostics(view.state, [diagnostic]))
    }, [error])

    return (
      <div
        ref={containerRef}
        className={cn("h-full min-h-0 w-full min-w-0", className)}
      />
    )
  },
)
