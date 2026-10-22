export type SizeRow = { size: string; a: string; b: string; c: string }
export type CategoryDraft = { cat: string; label: string; blurb: string; image: string; keyTouched: boolean }
export type CategoryErrors = Partial<Record<'label' | 'cat' | 'image', string>>
