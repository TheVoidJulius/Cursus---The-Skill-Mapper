import { useState, useCallback, useRef } from 'react'
import { NODE_COLORS, WEB_DEV_TEMPLATE, PROGRESS_STAGES } from '../utils/constants'
import { decodeMapFromHash } from '../utils/encode'
import { uid } from '../utils/uid'

// ─── Modes ────────────────────────────────────────────────────────────────────
export const MODE = { SELECT: 'sel', CONNECT: 'con', DELETE: 'del' }

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useSkillMap() {
  const colorIdx = useRef(0)

  // Try to restore from share link on first render
  const [nodes, setNodes] = useState(() => {
    const saved = decodeMapFromHash(window.location.hash)
    return saved ? saved.nodes : []
  })
  const [edges, setEdges] = useState(() => {
    const saved = decodeMapFromHash(window.location.hash)
    return saved ? saved.edges : []
  })

  const [mode, setMode] = useState(MODE.SELECT)
  const [connectSrc, setConnectSrc] = useState(null)   // id of first node in connect flow
  const [selectedId, setSelectedId] = useState(null)

  // ── Node CRUD ──────────────────────────────────────────────────────────────
  const addNode = useCallback((canvasWidth, canvasHeight) => {
    const x = Math.round(16 + Math.random() * Math.max(0, canvasWidth  - 164))
    const y = Math.round(16 + Math.random() * Math.max(0, canvasHeight - 110))
    const color = NODE_COLORS[colorIdx.current++ % NODE_COLORS.length]
    const node = { id: uid(), label: 'New skill', x, y, progressIdx: 0, color, editing: true }
    setNodes(prev => [...prev, node])
  }, [])

  const updateNode = useCallback((id, patch) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, ...patch } : n))
  }, [])

  const deleteNode = useCallback((id) => {
    setNodes(prev => prev.filter(n => n.id !== id))
    setEdges(prev => prev.filter(e => e.from !== id && e.to !== id))
    setSelectedId(s => s === id ? null : s)
  }, [])

  const moveNode = useCallback((id, x, y) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, x, y } : n))
  }, [])

  const cycleProgress = useCallback((id) => {
    setNodes(prev => prev.map(n =>
      n.id === id
        ? { ...n, progressIdx: (n.progressIdx + 1) % PROGRESS_STAGES.length }
        : n
    ))
  }, [])

  const startEditing = useCallback((id) => {
    setNodes(prev => prev.map(n => ({ ...n, editing: n.id === id })))
  }, [])

  const commitLabel = useCallback((id, raw) => {
    const label = raw.trim() || 'Untitled'
    setNodes(prev => prev.map(n =>
      n.id === id ? { ...n, label, editing: false } : n
    ))
  }, [])

  // ── Edge CRUD ──────────────────────────────────────────────────────────────
  const addEdge = useCallback((from, to) => {
    // Prevent duplicate or self-referencing edges
    setEdges(prev => {
      if (prev.some(e => e.from === from && e.to === to)) return prev
      return [...prev, { id: uid(), from, to }]
    })
  }, [])

  const deleteEdge = useCallback((id) => {
    setEdges(prev => prev.filter(e => e.id !== id))
  }, [])

  // ── Connect flow ───────────────────────────────────────────────────────────
  const handleNodeClick = useCallback((id) => {
    if (mode === MODE.DELETE) {
      deleteNode(id)
      return
    }
    if (mode === MODE.CONNECT) {
      if (!connectSrc) {
        setConnectSrc(id)
      } else if (connectSrc !== id) {
        addEdge(connectSrc, id)
        setConnectSrc(null)
        setMode(MODE.SELECT)
      }
      return
    }
    // SELECT mode — toggle selection
    setSelectedId(s => s === id ? null : id)
  }, [mode, connectSrc, addEdge, deleteNode])

  const cancelConnect = useCallback(() => {
    setConnectSrc(null)
  }, [])

  // ── Mode switching ─────────────────────────────────────────────────────────
  const changeMode = useCallback((m) => {
    setMode(m)
    setConnectSrc(null)
  }, [])

  // ── Template ───────────────────────────────────────────────────────────────
  const loadTemplate = useCallback(() => {
    setNodes(WEB_DEV_TEMPLATE.nodes.map(n => ({ ...n, editing: false })))
    setEdges(WEB_DEV_TEMPLATE.edges)
    setSelectedId(null)
    setConnectSrc(null)
    colorIdx.current = NODE_COLORS.length
  }, [])

  // ── Derived stats ──────────────────────────────────────────────────────────
  const stats = {
    nodeCount:    nodes.length,
    edgeCount:    edges.length,
    masteredCount: nodes.filter(n => n.progressIdx === PROGRESS_STAGES.length - 1).length,
    avgProgress:  nodes.length
      ? Math.round(nodes.reduce((s, n) => s + PROGRESS_STAGES[n.progressIdx].pct, 0) / nodes.length)
      : null,
  }

  return {
    nodes, edges,
    mode, changeMode,
    connectSrc, cancelConnect,
    selectedId, setSelectedId,
    addNode, updateNode, deleteNode, moveNode,
    cycleProgress, startEditing, commitLabel,
    addEdge, deleteEdge,
    handleNodeClick,
    loadTemplate,
    stats,
  }
}
