import { Card, CardHeader } from '@/components/cms/ui'

export default function DangerZone() {
  return (
    <Card className="mt-6 border-red-200">
      <CardHeader title="Danger zone" />
      <p className="p-4 text-[13px] text-muted-foreground">
        This demo keeps all data in memory. Products, orders, settings and every other change reset automatically when the page is reloaded, so there is nothing to wipe manually.
      </p>
    </Card>
  )
}
