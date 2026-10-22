import type { ReactNode } from 'react'
import { Btn, Card, CardHeader } from '@/components/cms/ui'

type Props = { title: string; description?: string; dirty: boolean; onSave: () => void; onReset: () => void; children: ReactNode }

export default function SectionShell({ title, description, dirty, onSave, onReset, children }: Props) {
  return (
    <Card>
      <CardHeader title={title} description={description} />
      <div className="grid gap-4 p-4">{children}</div>
      <div className="flex items-center justify-end gap-2 border-t border-border px-4 py-3">
        {dirty && <span className="mr-auto text-xs text-amber-600">Unsaved changes</span>}
        <Btn disabled={!dirty} onClick={onReset}>Reset</Btn>
        <Btn variant="primary" disabled={!dirty} onClick={onSave}>Save changes</Btn>
      </div>
    </Card>
  )
}
