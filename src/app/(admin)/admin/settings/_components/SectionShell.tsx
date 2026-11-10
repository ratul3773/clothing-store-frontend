import { CmsButton } from "@/components/ui/button";
import { Card, CardHeader } from '@/components/cms/ui';
import type { ReactNode } from 'react';

type Props = { title: string; description?: string; dirty: boolean; onSave: () => void; onReset: () => void; children: ReactNode }

export default function SectionShell({ title, description, dirty, onSave, onReset, children }: Props) {
  return (
    <Card>
      <CardHeader title={title} description={description} />
      <form onSubmit={(event) => { event.preventDefault(); onSave() }} noValidate>
        <div className="grid gap-4 p-4">{children}</div>
        <div className="flex items-center justify-end gap-2 border-t border-border px-4 py-3">
          {dirty && <span className="mr-auto text-xs text-amber-600">Unsaved changes</span>}
          <CmsButton variant="outline" disabled={!dirty} onClick={onReset}>Reset</CmsButton>
          <CmsButton type="submit" variant="default" disabled={!dirty}>Save changes</CmsButton>
        </div>
      </form>
    </Card>
  )
}
