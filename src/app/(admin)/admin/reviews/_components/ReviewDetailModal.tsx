'use client'

import { useState } from 'react'
import { Eye, EyeOff, Trash2 } from 'lucide-react'
import { useStore } from '@/components/providers/StoreProvider'
import Modal from '@/components/cms/Modal'
import AlertDialogText from '@/components/common/Alert-Dialogue'
import { Badge, Btn, Field, Textarea } from '@/components/cms/ui'
import { fmtDate, productOf, stars, statusOf } from '@/app/(admin)/admin/reviews/_utils/reviews.utils'

export default function ReviewDetailModal({ id, onClose }: { id: string | null; onClose: () => void }) {
  const { reviews, replyToReview, patchReview, removeReview, toast } = useStore()
  const r = reviews.find((x) => x.id === id)
  if (!r) return null
  return <Inner key={r.id} id={r.id} onClose={onClose} {...{ replyToReview, patchReview, removeReview, toast }} />
}

function Inner({ id, onClose, replyToReview, patchReview, removeReview, toast }: { id: string; onClose: () => void } & Pick<ReturnType<typeof useStore>, 'replyToReview' | 'patchReview' | 'removeReview' | 'toast'>) {
  const { reviews } = useStore()
  const r = reviews.find((x) => x.id === id)!
  const [reply, setReply] = useState(r.reply?.text ?? '')
  const [error, setError] = useState('')
  const [confirm, setConfirm] = useState(false)
  const p = productOf(r.productId)

  const saveReply = () => {
    if (!reply.trim()) return setError('Reply cannot be empty')
    setError('')
    replyToReview(r.id, reply.trim())
    toast('Reply saved')
  }

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
            <Btn variant="dangerOutline" onClick={() => setConfirm(true)}><Trash2 className="size-4" />Delete</Btn>
            <Btn onClick={() => { patchReview(r.id, { hidden: !r.hidden }); toast(r.hidden ? 'Review published' : 'Review hidden') }}>
              {r.hidden ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              {r.hidden ? 'Show' : 'Hide'}
            </Btn>
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
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} alt={`Review photo ${i + 1}`} className="size-24 rounded-md border border-border object-cover" />
              ))}
            </div>
          )}
          <Field label="Public reply" error={error}>
            <Textarea value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write a reply visible on the product page" />
          </Field>
          <div className="flex gap-2">
            <Btn variant="primary" onClick={saveReply}>{r.reply ? 'Update reply' : 'Post reply'}</Btn>
            {r.reply && <Btn onClick={() => { replyToReview(r.id, null); setReply(''); toast('Reply removed') }}>Remove reply</Btn>}
          </div>
        </div>
      </Modal>
      <AlertDialogText mode="normal" open={confirm} onOpenChange={setConfirm} title="Delete review?" description="This permanently removes the review from the store." actionType="delete" onConfirm={() => { removeReview(r.id); toast('Review deleted'); onClose() }} />
    </>
  )
}
