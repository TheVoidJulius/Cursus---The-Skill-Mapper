import React, { useRef, useState, useCallback } from 'react'
import Toolbar from './components/Toolbar'
import Canvas from './components/Canvas'
import StatusBar from './components/StatusBar'
import ShareModal from './components/ShareModal'
import Toast from './components/Toast'
import { useSkillMap, MODE } from './hooks/useSkillMap'
import { buildShareURL } from './utils/encode'
import styles from './App.module.css'



export default function App() {
  const canvasRef = useRef(null)

  const {
    nodes, edges,
    mode, changeMode,
    connectSrc, cancelConnect,
    selectedId, setSelectedId,
    addNode, deleteNode, moveNode,
    cycleProgress, startEditing, commitLabel,
    deleteEdge,
    handleNodeClick,
    loadTemplate,
    stats,
  } = useSkillMap()

  // ── Share modal ──────────────────────────────────────────────────────────
  const [shareURL, setShareURL] = useState(null)

  function openShare() {
    setShareURL(buildShareURL(nodes, edges))
  }

  // ── Toast messages ───────────────────────────────────────────────────────
  const [toast, setToast] = useState(null)

  const notify = useCallback((msg) => setToast(msg), [])

  // ── Canvas size helper (passed to addNode so nodes land inside viewport) ─
  function getCanvasSize() {
    if (!canvasRef.current) return { w: 800, h: 500 }
    const r = canvasRef.current.getBoundingClientRect()
    return { w: r.width, h: r.height }
  }

  // ── Handlers ─────────────────────────────────────────────────────────────
  function handleAddNode() {
    const { w, h } = getCanvasSize()
    addNode(w, h)
    notify('Skill added — double-click to rename')
  }

  function handleLoadTemplate() {
    loadTemplate()
    notify('Web dev roadmap loaded')
  }

  function handleNodeClickWithToast(id) {
    handleNodeClick(id)
    if (mode === MODE.DELETE) notify('Skill removed')
    if (mode === MODE.CONNECT && connectSrc && connectSrc !== id) notify('Connection created')
    if (mode === MODE.CONNECT && !connectSrc) notify('Now click a destination skill')
  }

  function handleDeleteEdge(id) {
    deleteEdge(id)
    notify('Connection removed')
  }

  function handleBgClick() {
    // Deselect + cancel pending connect on background click
    setSelectedId(null)
    if (connectSrc) cancelConnect()
  }

  // ── Drag helpers (passed through Canvas → SkillNode) ─────────────────────
  // moveStart / moveEnd exist in case you want to add snapping or undo history
  const handleMoveStart = useCallback((_id) => { }, [])
  const handleMoveEnd = useCallback((_id) => { }, [])

  return (
    <div className={styles.app}>
      <Toolbar
        mode={mode}
        onChangeMode={changeMode}
        onAddNode={handleAddNode}
        onLoadTemplate={handleLoadTemplate}
        onShare={openShare}
      />

      <div className={styles.canvasWrapper} ref={canvasRef}>
        <Canvas
          nodes={nodes}
          edges={edges}
          mode={mode}
          connectSrc={connectSrc}
          selectedId={selectedId}
          onNodeClick={handleNodeClickWithToast}
          onNodeDoubleClick={startEditing}
          onNodeMoveStart={handleMoveStart}
          onNodeMove={moveNode}
          onNodeMoveEnd={handleMoveEnd}
          onCycleProgress={cycleProgress}
          onCommitLabel={commitLabel}
          onDeleteEdge={handleDeleteEdge}
          onBgClick={handleBgClick}
        />

        {/* Toast sits inside the canvas wrapper so it's positioned relative to it */}
        <Toast message={toast} onDone={() => setToast(null)} />
      </div>

      <StatusBar stats={stats} mode={mode} connectSrc={connectSrc} />

      {/* Share modal is a portal-style overlay */}
      {shareURL && (
        <ShareModal url={shareURL} onClose={() => setShareURL(null)} />
      )}
    </div>
  )
}
