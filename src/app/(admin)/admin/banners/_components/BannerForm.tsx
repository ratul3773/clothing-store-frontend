'use client'

import { useState } from 'react'
import { banners, type Banner } from '@/data/site'
import { saveBanner, uid } from '@/data/cms'
import { useStore } from '@/components/providers/StoreProvider'
import Modal from '@/components/cms/Modal'
import ImageField from '@/components/cms/ImageField'
import { Btn, Field, Input, Select, Switch } from '@/components/cms/ui'
import { bannerToDraft, draftToBanner, validateBanner, type BannerDraft } from '../_utils/banner.utils'
import BannerPreview from './BannerPreview'

type Props = { open: boolean; onOpenChange: (o: boolean) => void; banner: Banner | null }

export default function BannerForm({ open, onOpenChange, banner }: Props) {
  return open ? <Inner key={banner?.id ?? 'new'} onOpenChange={onOpenChange} banner={banner} /> : null
}

function Inner({ onOpenChange, banner }: Omit<Props, 'open'>) {
  const { toast } = useStore()
  const [d, setD] = useState<BannerDraft>(() => bannerToDraft(banner, Math.max(0, ...banners.map((b) => b.order)) + 1))
  const [submitted, setSubmitted] = useState(false)
  const errors = validateBanner(d)
  const err = (k: keyof typeof errors) => (submitted ? errors[k] : undefined)
  const set = <K extends keyof BannerDraft>(k: K, v: BannerDraft[K]) => setD((x) => ({ ...x, [k]: v }))

  const submit = () => {
    setSubmitted(true)
    if (Object.keys(errors).length) return
    saveBanner(draftToBanner(d, banner?.id ?? uid('b')))
    toast(banner ? 'Banner updated' : 'Banner created')
    onOpenChange(false)
  }

  return (
    <Modal open onOpenChange={onOpenChange} size="lg" title={banner ? 'Edit banner' : 'New banner'} footer={<><Btn onClick={() => onOpenChange(false)}>Cancel</Btn><Btn variant="primary" onClick={submit}>Save</Btn></>}>
      <div className="grid gap-4">
        <BannerPreview d={d} />
        <Field label="Title" error={err('title')}><Input value={d.title} onChange={(e) => set('title', e.target.value)} /></Field>
        <Field label="Subtitle"><Input value={d.subtitle} onChange={(e) => set('subtitle', e.target.value)} /></Field>
        <div>
          <p className="mb-1 text-xs font-medium text-foreground/80">Image</p>
          <ImageField value={d.image} onChange={(v) => set('image', v)} />
          {err('image') && <p className="mt-1 text-xs text-red-600">{err('image')}</p>}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Button label"><Input value={d.ctaLabel} onChange={(e) => set('ctaLabel', e.target.value)} /></Field>
          <Field label="Button link" error={err('ctaLink')}><Input value={d.ctaLink} onChange={(e) => set('ctaLink', e.target.value)} /></Field>
          <Field label="Placement"><Select value={d.placement} onChange={(e) => set('placement', e.target.value as Banner['placement'])}><option value="hero">Hero</option><option value="promo">Promo</option></Select></Field>
          <Field label="Order" error={err('order')}><Input type="number" min={0} value={d.order} onChange={(e) => set('order', e.target.value)} /></Field>
          <Field label="Starts (optional)"><Input type="datetime-local" value={d.startsAt} onChange={(e) => set('startsAt', e.target.value)} /></Field>
          <Field label="Ends (optional)" error={err('endsAt')}><Input type="datetime-local" value={d.endsAt} onChange={(e) => set('endsAt', e.target.value)} /></Field>
        </div>
        <Switch checked={d.active} onChange={(v) => set('active', v)} label="Active" />
      </div>
    </Modal>
  )
}
