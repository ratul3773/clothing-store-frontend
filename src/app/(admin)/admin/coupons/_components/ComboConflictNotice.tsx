import { CmsButton } from "@/components/ui/button";


export default function ComboConflictNotice({
  active,
  onDeactivate,
  onReplacement,
}: {
  active: boolean;
  onDeactivate: () => void;
  onReplacement: () => void;
}) {
  return (
    <div className="space-y-2 rounded border border-border p-3 text-sm">
      <p>
        Cart-referenced contents cannot change, including references in expired
        guest carts awaiting cleanup. Your draft is preserved. Deactivation and
        replacement are separate actions.
      </p>
      <div className="flex flex-wrap gap-2">
        <CmsButton variant="outline" disabled={!active} onClick={onDeactivate}>
          Deactivate existing combo
        </CmsButton>
        <CmsButton variant="outline" onClick={onReplacement}>Create replacement from draft</CmsButton>
      </div>
    </div>
  );
}
