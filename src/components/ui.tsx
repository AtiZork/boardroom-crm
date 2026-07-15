import type { BrandId, Stage } from "@/lib/types";
import { brandColor, brandName } from "@/lib/logic";

export function StagePill({ stage }: { stage: Stage }) {
  const cls =
    stage === "Lead"
      ? "pill lead"
      : stage === "Active Pipeline"
        ? "pill pipe"
        : "pill client";
  return <span className={cls}>{stage}</span>;
}

export function BrandPill({ brandId }: { brandId: BrandId }) {
  return (
    <span className="brand-pill" style={{ ["--b" as string]: brandColor(brandId) }}>
      {brandName(brandId)}
    </span>
  );
}

export function EmailFlag({ on }: { on: boolean }) {
  return (
    <span className={on ? "email-flag on" : "email-flag off"}>
      {on ? "Marketing ON" : "Marketing OFF"}
    </span>
  );
}

export function SectionTitle({
  title,
  hint,
}: {
  title: string;
  hint?: string;
}) {
  return (
    <div className="section-head">
      <h1>{title}</h1>
      {hint ? <p>{hint}</p> : null}
    </div>
  );
}
