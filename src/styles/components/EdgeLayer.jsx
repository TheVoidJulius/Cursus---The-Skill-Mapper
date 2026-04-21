import React from 'react'

const NODE_W = 152
const NODE_H = 100  // approximate vertical centre

// ─── EdgeLayer ────────────────────────────────────────────────────────────────
// Renders all directed edges as cubic-bezier dashed arrows on an SVG overlay.
// In DELETE mode, a clickable ✕ button appears at each edge midpoint.
//
// Props:
//   nodes     — node array (need x, y, id)
//   edges     — edge array { id, from, to }
//   deleteMode — boolean — show delete handles
//   onDelete  — (edgeId) => void

export default function EdgeLayer({ nodes, edges, deleteMode, onDelete }) {
  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]))

  return (
    <>
      <svg
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none', zIndex: 2,
          overflow: 'visible',
        }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="6" markerHeight="5"
            refX="5" refY="2.5"
            orient="auto"
          >
            <polygon points="0 0,6 2.5,0 5" fill="#888" opacity="0.7" />
          </marker>
        </defs>

        {edges.map(edge => {
          const fn = nodeMap[edge.from]
          const tn = nodeMap[edge.to]
          if (!fn || !tn) return null

          const x1 = fn.x + NODE_W / 2
          const y1 = fn.y + NODE_H / 2
          const x2 = tn.x + NODE_W / 2
          const y2 = tn.y + NODE_H / 2
          const dx = x2 - x1

          const d = `M ${x1} ${y1} C ${x1 + dx * 0.5} ${y1}, ${x2 - dx * 0.5} ${y2}, ${x2} ${y2}`

          return (
            <path
              key={edge.id}
              d={d}
              fill="none"
              stroke="var(--color-text-tertiary)"
              strokeWidth="1.5"
              strokeDasharray="5 3"
              markerEnd="url(#arrowhead)"
              opacity="0.65"
            />
          )
        })}
      </svg>

      {/* Delete handles — rendered as DOM buttons (not SVG) so they're easy to click */}
      {deleteMode && edges.map(edge => {
        const fn = nodeMap[edge.from]
        const tn = nodeMap[edge.to]
        if (!fn || !tn) return null
        const mid = bezierMid(fn, tn, 0.5)
        return (
          <button
            key={`del-${edge.id}`}
            title="Delete connection"
            onClick={e => { e.stopPropagation(); onDelete(edge.id) }}
            style={{
              position: 'absolute',
              left: mid.x,
              top: mid.y,
              transform: 'translate(-50%, -50%)',
              zIndex: 8,
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: '#fdf0f0',
              border: '0.5px solid #f09595',
              color: '#a32d2d',
              fontSize: 12,
              lineHeight: 1,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-sans)',
            }}
          >
            ×
          </button>
        )
      })}
    </>
  )
}

// Evaluate a cubic-bezier point at parameter t (0–1)
function bezierMid(fn, tn, t) {
  const x1 = fn.x + NODE_W / 2, y1 = fn.y + NODE_H / 2
  const x2 = tn.x + NODE_W / 2, y2 = tn.y + NODE_H / 2
  const dx = x2 - x1
  const cp1x = x1 + dx * 0.5, cp2x = x2 - dx * 0.5
  const u = 1 - t
  return {
    x: u*u*u*x1 + 3*u*u*t*cp1x + 3*u*t*t*cp2x + t*t*t*x2,
    y: u*u*u*y1 + 3*u*u*t*y1   + 3*u*t*t*y2   + t*t*t*y2,
  }
}
