export const SETTINGS_TABS = [
  { id: 'general', label: 'General' },
  { id: 'delivery', label: 'Delivery & payments' },
  { id: 'announcement', label: 'Announcement bar' },
  { id: 'orders', label: 'Orders' },
  { id: 'seo', label: 'SEO & social' },
  { id: 'account', label: 'Account & security' },
] as const

export type SettingsTab = (typeof SETTINGS_TABS)[number]['id']
