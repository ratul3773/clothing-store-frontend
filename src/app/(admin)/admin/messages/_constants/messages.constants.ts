export const TABS = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'open', label: 'Open' },
  { value: 'resolved', label: 'Resolved' },
] as const
export type Tab = (typeof TABS)[number]['value']
export const PAGE_SIZE = 8
