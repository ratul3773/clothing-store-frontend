'use client'

import { useSearchParams } from '@/lib/nav'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/cms/ui'
import { SETTINGS_TABS, type SettingsTab } from '../_constants/settings.constants'
import AccountSection from './AccountSection'
import AnnouncementSection from './AnnouncementSection'
import DangerZone from './DangerZone'
import DeliverySection from './DeliverySection'
import GeneralSection from './GeneralSection'
import OrdersSection from './OrdersSection'
import SeoSection from './SeoSection'

const sections: Record<SettingsTab, () => React.ReactNode> = {
  general: () => <GeneralSection />,
  delivery: () => <DeliverySection />,
  announcement: () => <AnnouncementSection />,
  orders: () => <OrdersSection />,
  seo: () => <SeoSection />,
  account: () => <AccountSection />,
}

export default function SettingsView() {
  const [sp, setSp] = useSearchParams()
  const raw = sp.get('tab') as SettingsTab | null
  const tab: SettingsTab = raw && raw in sections ? raw : 'general'
  return (
    <>
      <PageHeader title="Settings" description="Store configuration." crumbs={['Admin', 'Settings']} />
      <div className="grid gap-6 md:grid-cols-[200px_1fr]">
        <nav className="flex gap-1 overflow-x-auto md:flex-col">
          {SETTINGS_TABS.map((t) => (
            <button key={t.id} type="button" onClick={() => setSp({ tab: t.id })} className={cn('whitespace-nowrap rounded-md px-3 py-1.5 text-left text-[13px] font-medium', tab === t.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
              {t.label}
            </button>
          ))}
        </nav>
        <div className="min-w-0">
          {/* key remounts the section so drafts reset when switching tabs */}
          <div key={tab}>{sections[tab]()}</div>
          {tab === 'general' && <DangerZone />}
        </div>
      </div>
    </>
  )
}
