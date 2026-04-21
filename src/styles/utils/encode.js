// ─── URL Share Encoding ───────────────────────────────────────────────────────
// The full roadmap is serialised to JSON → base64 and stored in window.location.hash
// so no backend is needed. Anyone with the link gets the exact same canvas state.

export function encodeMapToHash(nodes, edges) {
  const payload = { nodes, edges }
  const json = JSON.stringify(payload)
  // btoa doesn't handle unicode — go through URI encoding first
  const base64 = btoa(unescape(encodeURIComponent(json)))
  return `#sm=${base64}`
}

export function decodeMapFromHash(hash) {
  const match = hash.match(/#sm=(.+)/)
  if (!match) return null
  try {
    const json = decodeURIComponent(escape(atob(match[1])))
    const data = JSON.parse(json)
    if (!Array.isArray(data.nodes) || !Array.isArray(data.edges)) return null
    // Strip any runtime-only fields (e.g. editing flag) before returning
    return {
      nodes: data.nodes.map(({ editing: _e, ...rest }) => rest),
      edges: data.edges,
    }
  } catch {
    return null
  }
}

export function buildShareURL(nodes, edges) {
  const hash = encodeMapToHash(nodes, edges)
  return `${window.location.origin}${window.location.pathname}${hash}`
}
