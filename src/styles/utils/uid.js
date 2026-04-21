// Lightweight unique-id generator — no dependency needed
export const uid = () => Math.random().toString(36).slice(2, 8)
