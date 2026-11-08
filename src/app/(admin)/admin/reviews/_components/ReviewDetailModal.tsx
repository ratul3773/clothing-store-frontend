'use client'

import { CmsButton } from "@/components/ui/button";
import { fmtDate, productOf, stars, statusOf } from '@/app/(admin)/admin/reviews/_utils/reviews.utils'
import Modal from '@/components/cms/Modal'
import { Badge } from '@/components/cms/ui';
import AlertDialogText from '@/components/common/Alert-Dialogue'
import { FormField } from '@/components/common/form-field'
import { useStore } from '@/components/providers/StoreProvider'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { replySchema } from '../_schemas/reply.schema'

export default function ReviewDetailModal({ id, onClose }: { id: string | null; onClose: () => void }) {
  const { reviews, replyToReview, patchReview, removeReview, toast } = useStore()
  const r = reviews.find((x) => x.id === id)
  if (!r) return null
  return <Inner key={r.id} id={r.id} onClose={onClose} {...{ replyToReview, patchReview, removeReview, toast }} />
}

function Inner({ id, onClose, replyToReview, patchReview, removeReview, toast }: { id: string; onClose: () => void } & Pick<ReturnType<typeof useStore>, 'replyToReview' | 'patchReview' | 'removeReview' | 'toast'>) {
  const { reviews } = useStore()
  const r = reviews.find((x) => x.id === id)!
  const form = useForm({ resolver: zodResolver(replySchema), defaultValues: { reply: r.reply?.text ?? '' } })
  const [confirm, setConfirm] = useState(false)
  const p = productOf(r.productId)

  const saveReply = form.handleSubmit(({ reply }) => {
    replyToReview(r.id, reply)
    form.reset({ reply })
    toast('Reply saved')
  })

  return (
    <>
      <Modal
        open
        onOpenChange={(o) => !o && onClose()}
        size="lg"
        title={`Review by ${r.author}`}
        description={`${p?.name ?? 'Unknown product'} · ${fmtDate(r.createdAt)}`}
        footer={
          <>
            <CmsButton variant="destructive" onClick={() => setConfirm(true)}><Trash2 className="size-4" />Delete</CmsButton>
            <CmsButton variant="outline" onClick={() => { patchReview(r.id, { hidden: !r.hidden }); toast(r.hidden ? 'Review published' : 'Review hidden') }}>
              {r.hidden ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              {r.hidden ? 'Show' : 'Hide'}
            </CmsButton>
          </>
        }
      >
        <div className="space-y-4 text-[13px]">
          <div className="flex items-center gap-2">
            <span className="text-base tracking-wide text-amber-500">{stars(r.rating)}</span>
            <Badge>{r.fit}</Badge>
            <Badge tone={r.hidden ? 'red' : r.reply ? 'green' : 'blue'}>{statusOf(r)}</Badge>
            {r.orderId && <span className="text-xs text-muted-foreground">Order {r.orderId}</span>}
          </div>
          <p className="whitespace-pre-wrap leading-relaxed">{r.text}</p>
          {r.images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {r.images.map((src, i) => (
                <Image width={96} height={96} key={i} src={src} alt={`Review photo ${i + 1}`} className="size-24 rounded-md border border-border object-cover" />
              ))}
            </div>
          )}
          <form id="review-reply" onSubmit={saveReply} noValidate>
            <FormField form={form} id="review-reply-text" name="reply" isAdmin isTextArea label="Public reply" placeholder="Write a reply visible on the product page" />
          </form>
          <div className="flex gap-2">
            <CmsButton type="submit" form="review-reply" variant="default">{r.reply ? 'Update reply' : 'Post reply'}</CmsButton>
            {r.reply && <CmsButton variant="outline" onClick={() => { replyToReview(r.id, null); form.reset({ reply: '' }); toast('Reply removed') }}>Remove reply</CmsButton>}
          </div>
        </div>
      </Modal>
      <AlertDialogText mode="normal" open={confirm} onOpenChange={setConfirm} title="Delete review?" description="This permanently removes the review from the store." actionType="delete" onConfirm={() => { removeReview(r.id); toast('Review deleted'); onClose() }} />
    </>
  )
}
