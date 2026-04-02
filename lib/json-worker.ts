self.onmessage = (e: MessageEvent<string>) => {
  try {
    const data = JSON.parse(e.data)
    self.postMessage({ ok: true, data })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    self.postMessage({ ok: false, error: message })
  }
}
