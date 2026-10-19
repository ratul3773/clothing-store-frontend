'use client'

import { useSyncExternalStore } from 'react'
import { getVersion, subscribe } from '@/data/site'

/** Re-renders the caller whenever CMS data (products, banners, settings…) changes. */
export function useCms() {
  return useSyncExternalStore(subscribe, getVersion, () => 0)
}
