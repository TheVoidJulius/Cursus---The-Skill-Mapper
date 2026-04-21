
export const PROGRESS_STAGES = [
  { label: 'Not started', color: '#c5c5c0', pct: 0 },
  { label: 'Learning', color: '#378ADD', pct: 25 },
  { label: 'Halfway', color: '#EF9F27', pct: 50 },
  { label: 'Almost done', color: '#7F77DD', pct: 75 },
  { label: 'Mastered', color: '#1D9E75', pct: 100 },
]

export const NODE_COLORS = [
  '#378ADD',  // blue
  '#1D9E75',  // teal
  '#BA7517',  // amber
  '#7F77DD',  // purple
  '#D85A30',  // coral
]

export const GRID_SIZE = 24


export const WEB_DEV_TEMPLATE = {
  nodes: [
    { id: 't1', label: 'HTML & CSS', x: 24, y: 32, progressIdx: 4, color: '#378ADD' },
    { id: 't2', label: 'JavaScript', x: 196, y: 32, progressIdx: 3, color: '#1D9E75' },
    { id: 't3', label: 'React', x: 368, y: 32, progressIdx: 2, color: '#7F77DD' },
    { id: 't4', label: 'Node.js', x: 196, y: 162, progressIdx: 1, color: '#BA7517' },
    { id: 't5', label: 'SQL Databases', x: 24, y: 162, progressIdx: 2, color: '#D85A30' },
    { id: 't6', label: 'TypeScript', x: 368, y: 162, progressIdx: 0, color: '#378ADD' },
    { id: 't7', label: 'System Design', x: 196, y: 292, progressIdx: 0, color: '#7F77DD' },
  ],
  edges: [
    { id: 'e1', from: 't1', to: 't2' },
    { id: 'e2', from: 't2', to: 't3' },
    { id: 'e3', from: 't2', to: 't4' },
    { id: 'e4', from: 't1', to: 't5' },
    { id: 'e5', from: 't3', to: 't6' },
    { id: 'e6', from: 't4', to: 't7' },
    { id: 'e7', from: 't5', to: 't7' },
  ],
}
