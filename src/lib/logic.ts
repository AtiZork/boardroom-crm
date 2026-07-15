import type { BrandId, RecordItem, Stage } from "./types";
import { BRANDS, SERVICES } from "./seed";

export function brandName(id: BrandId) {
  return BRANDS.find((b) => b.id === id)?.name ?? id;
}

export function brandColor(id: BrandId) {
  return BRANDS.find((b) => b.id === id)?.color ?? "#266363";
}

export function serviceName(id: string) {
  return SERVICES.find((s) => s.id === id)?.name ?? id;
}

export function formatClientId(seq: number) {
  return `CL-${seq}`;
}

export function marketingShouldBeOn(stage: Stage) {
  return stage === "Lead";
}

export function filterByBrand(
  records: RecordItem[],
  selected: BrandId | "ALL",
) {
  if (selected === "ALL") return records;
  return records.filter((r) => r.brandId === selected);
}

/** Inverted cross-sell: has includeService, does NOT have excludeService */
export function invertedCrossSell(
  records: RecordItem[],
  includeService: string | null,
  excludeService: string | null,
) {
  return records.filter((r) => {
    if (r.stage !== "Active Client") return false;
    const hasInclude = includeService
      ? r.services.includes(includeService as never)
      : true;
    const missingExclude = excludeService
      ? !r.services.includes(excludeService as never)
      : true;
    return hasInclude && missingExclude;
  });
}

export function stageCounts(records: RecordItem[]) {
  return {
    Lead: records.filter((r) => r.stage === "Lead").length,
    "Active Pipeline": records.filter((r) => r.stage === "Active Pipeline")
      .length,
    "Active Client": records.filter((r) => r.stage === "Active Client").length,
  };
}

export function winsByBrand(records: RecordItem[]) {
  return BRANDS.map((b) => ({
    brand: b,
    count: records.filter(
      (r) => r.brandId === b.id && r.stage === "Active Client",
    ).length,
  }));
}

export function isolationHealth(records: RecordItem[]) {
  // Demo metric: marketing emails must only be on for Lead stage
  const leaks = records.filter(
    (r) => r.marketingEmailsOn && r.stage !== "Lead",
  ).length;
  return { crossBrandMatches: 0, emailRuleViolations: leaks };
}
