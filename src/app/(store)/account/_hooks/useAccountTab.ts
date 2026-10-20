import { useSearchParams } from '@/lib/nav'

export default function useAccountTab() {
  const [sp, setSearchParams] = useSearchParams()
  const tab = sp.get('tab') ?? 'orders'
  const setTab = (v: string) => {
    setSearchParams({ tab: v })
  }
  return [tab, setTab] as const
}
