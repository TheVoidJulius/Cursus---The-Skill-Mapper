import React, { useRef, useCallback } from 'react'
import SkillNode from './SkillNode'
import EdgeLayer from './EdgeLayer'
import { MODE } from '../hooks/useSkillMap'
import styles from './Canvas.module.css'

// ─── Canvas ───────────────────────────────────────────────────────────────────
// The main interactive area. Handles:
//   • Node drag (SELECT mode)
//   • Background click (deselect / cancel connect)
//   • Forwarding clicks/double-clicks to the hook

export default function Canvas({
  nodes, edges,
  mode, connectSrc,
  selectedId,
  onNodeClick,
  onNodeDoubleClick,
  onNodeMoveStart,
  onNodeMove,
  onNodeMoveEnd,
  onCycleProgress,
  onCommitLabel,
  onDeleteEdge,
  onBgClick,
}) {
  const canvasRef = useRef(null)
  const dragRef   = useRef(null)  // { nodeId, offsetX, offsetY }

  const getCursorStyle = () => {
    if (mode === MODE.DELETE)  return 'crosshair'
    if (mode === MODE.CONNECT) return 'cell'
    return 'default'
  }

  // ── Drag start (called from SkillNode onMouseDown) ─────────────────────────
  const handleNodeMouseDown = useCallback((e, nodeId) => {
    if (mode !== MODE.SELECT) return
    e.stopPropagation()
    const rect = canvasRef.current.getBoundingClientRect()
    const node = nodes.find(n => n.id === nodeId)
    if (!node) return
    dragRef.current = {
      nodeId,
      offsetX: e.clientX - rect.left - node.x,
      offsetY: e.clientY - rect.top  - node.y,
    }
    onNodeMoveStart(nodeId)
  }, [mode, nodes, onNodeMoveStart])

  // ── Mouse move on canvas ───────────────────────────────────────────────────
  const handleMouseMove = useCallback((e) => {
    if (!dragRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(rect.width  - 152, e.clientX - rect.left - dragRef.current.offsetX))
    const y = Math.max(0, Math.min(rect.height - 100, e.clientY - rect.top  - dragRef.current.offsetY))
    onNodeMove(dragRef.current.nodeId, Math.round(x), Math.round(y))
  }, [onNodeMove])

  const handleMouseUp = useCallback(() => {
    if (dragRef.current) {
      onNodeMoveEnd(dragRef.current.nodeId)
      dragRef.current = null
    }
  }, [onNodeMoveEnd])

  const isEmpty = nodes.length === 0

  return (
    <div
      ref={canvasRef}
      className={styles.canvas}
      style={{ cursor: getCursorStyle() }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={onBgClick}
    >
      {/* Dot-grid background — pure CSS, no canvas needed */}
      <div className={styles.grid} />

      {/* SVG edges + delete handles */}
      <EdgeLayer
        nodes={nodes}
        edges={edges}
        deleteMode={mode === MODE.DELETE}
        onDelete={onDeleteEdge}
      />

      {/* Skill nodes */}
      {nodes.map(node => (
        <SkillNode
          key={node.id}
          node={node}
          selected={node.id === selectedId}
          onMouseDown={e => handleNodeMouseDown(e, node.id)}
          onClick={e => { e.stopPropagation(); onNodeClick(node.id) }}
          onDoubleClick={e => { e.stopPropagation(); onNodeDoubleClick(node.id) }}
          onCycleProgress={onCycleProgress}
          onCommitLabel={onCommitLabel}
        />
      ))}

      {/* Connect-mode pulse ring */}
      {connectSrc && (() => {
        const n = nodes.find(n => n.id === connectSrc)
        if (!n) return null
        return (
          <div
            className={styles.pulse}
            style={{ left: n.x + 76, top: n.y + 44 }}
          />
        )
      })()}

      {/* Empty state */}
      {isEmpty && (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>⬡</span>
          <p>Your roadmap is empty</p>
          <small>Click "Add skill" or load a template to get started</small>
          <small>Double-click a node to rename · click the progress bar to advance</small>
        </div>
      )}
    </div>
  )
}
