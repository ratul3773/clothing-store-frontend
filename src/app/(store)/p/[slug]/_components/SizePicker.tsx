"use client";

import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LOW_STOCK_THRESHOLD } from "@/app/(store)/p/[slug]/_constants/product.constants";

interface Props {
  sizes: string[];
  selected: string | null;
  avail: number | null;
  shake?: number;
  stockFor: (size: string) => number;
  onSelect: (s: string) => void;
  onAssist?: () => void;
  disabled?: boolean;
  minimumQuantity?: number;
  showStockCounts?: boolean;
  stockUnit?: string;
}

export default function SizePicker({
  sizes,
  selected,
  avail,
  shake = 0,
  stockFor,
  onSelect,
  onAssist,
  disabled = false,
  minimumQuantity = 1,
  showStockCounts = false,
  stockUnit,
}: Props) {
  return (
    <motion.div
      key={shake}
      animate={shake ? { x: [0, -8, 8, -5, 5, 0] } : {}}
      className="mt-2"
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="label-mono">Size</p>
        {onAssist && (
          <Button
            type="button"
            variant="link"
            size="xs"
            onClick={onAssist}
            className="label-mono group h-auto gap-1.5 p-0 text-accent"
          >
            <Sparkles size={14} className="transition group-hover:rotate-90" />{" "}
            Find my size
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        {sizes.map((s) => {
          const n = stockFor(s);
          const unavailable = n < minimumQuantity;
          return (
            <Button
              key={s}
              type="button"
              variant="outline"
              size="icon-sm"
              disabled={disabled || unavailable}
              aria-label={`${s}, ${n} ${stockUnit ?? "items"} available`}
              aria-pressed={selected === s}
              onClick={() => onSelect(s)}
              className={cn(
                "relative h-10 w-auto min-w-10 px-3 font-semibold transition [&>span]:static",
                showStockCounts &&
                  "h-auto min-w-20 py-2 [&>span]:flex-col [&>span]:gap-1",
                selected === s
                  ? "border-foreground bg-foreground text-background"
                  : "border-foreground/30 hover:-translate-y-0.5 hover:border-foreground",
                unavailable &&
                  "cursor-not-allowed opacity-35 hover:translate-y-0 hover:border-foreground/30",
              )}
            >
              <span>{s}</span>
              {/* {showStockCounts && (
                <span className="text-[0.65rem] font-normal">
                  {n > 0 ? `${n} available` : "Out of stock"}
                </span>
              )} */}
              {n === 0 && (
                <span
                  aria-hidden
                  className="absolute inset-0 grid place-items-center"
                >
                  <span className="h-px w-[140%] -rotate-[35deg] bg-foreground" />
                </span>
              )}
            </Button>
          );
        })}
      </div>
      <p className="mt-3 min-h-5 text-sm" aria-live="polite">
        {selected &&
          avail !== null &&
          (stockUnit ? (
            <span
              className={
                avail < minimumQuantity ? "text-destructive" : "text-success"
              }
            >
              {avail} {stockUnit} available in {selected}
              {avail > 0 && avail < minimumQuantity
                ? " — reduce the combo quantity"
                : ""}
            </span>
          ) : avail <= LOW_STOCK_THRESHOLD ? (
            <span className="font-medium text-warning">
              Only {avail} left in {selected}
            </span>
          ) : (
            <span className="text-success">In stock ({avail} left)</span>
          ))}
      </p>
    </motion.div>
  );
}
