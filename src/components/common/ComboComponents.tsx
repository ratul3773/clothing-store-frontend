import Image from "next/image";
import Link from "next/link";
import type { ComboComponent, CartComboSelection } from "@/redux/apis/types/combo.types";
import { bdt } from "@/lib/utils";

export default function ComboComponents({ items, selections = [], compact = false }: { items: ComboComponent[]; selections?: CartComboSelection[]; compact?: boolean }) {
  return <ul className={compact ? "space-y-1 text-xs" : "my-5 space-y-3"} aria-label="Included pieces">
    {items.map((item) => <li key={item.colorId} className="flex items-center gap-3">
      {!compact && <Image width={48} height={60} src={item.product.imageUrl || "/product-placeholder.svg"} alt="" className="h-15 w-12 rounded bg-muted object-cover" />}
      <div><Link href={`/p/${encodeURIComponent(item.product.slug)}`} className="font-medium hover:underline">{item.product.name}</Link>
        <p className="text-muted-foreground">{item.color.name}{selections.find((selection) => selection.comboItemId === item.id) ? ` / ${selections.find((selection) => selection.comboItemId === item.id)!.size}` : ""} × {item.quantity}</p></div>
      {!compact && <span className="ml-auto text-sm text-muted-foreground">{bdt(item.product.unitPrice)} each</span>}
    </li>)}
  </ul>;
}
