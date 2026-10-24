import { TextShimmerWave } from "@/components/animation/text-shimmer";
import { TwinOrbit } from "@/components/animation/twin-orbit";

export default function Loading({ text }: { text?: string }) {
  return (
    <div
      className=" flex flex-col items-center gap-5 justify-center min-h-[60vh]"
      role="status"
      aria-label="Loading account"
      aria-busy="true"
    >
      <TwinOrbit className="size-3 text-accent"/>
      <TextShimmerWave className="text-primary label-mono">{text || "Loading account..."}</TextShimmerWave>
    </div>
  )
}
