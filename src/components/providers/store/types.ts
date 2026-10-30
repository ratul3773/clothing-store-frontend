export type Line = { key: string; productId?: string; comboId?: string; color: string; size: string; qty: number }
export type Address = { id: string; label: string; name: string; phone: string; line: string; city: string; isDefault: boolean }
export type User = { name: string; email: string; phone: string; verified: boolean; password?: string; addresses?: Address[]; }
