"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { formatClientId, marketingShouldBeOn } from "./logic";
import { INITIAL_NEXT_CLIENT_SEQ, SEED_RECORDS } from "./seed";
import type {
  AppState,
  BrandId,
  RecordItem,
  ServiceId,
  Stage,
} from "./types";

const STORAGE_KEY = "boardroom-crm-v1";

interface CrmContextValue extends AppState {
  hydrated: boolean;
  setSelectedBrand: (b: BrandId | "ALL") => void;
  advanceStage: (id: string) => void;
  setStage: (id: string, stage: Stage) => void;
  toggleService: (id: string, service: ServiceId) => void;
  addLead: (input: {
    company: string;
    contact: string;
    brandId: BrandId;
    owner: string;
  }) => void;
  resetDemo: () => void;
}

const CrmContext = createContext<CrmContextValue | null>(null);

function today() {
  return new Date().toISOString().slice(0, 10);
}

function applyStageRules(
  record: RecordItem,
  stage: Stage,
  nextSeq: number,
): { record: RecordItem; nextSeq: number } {
  let clientId = record.clientId;
  let clientSince = record.clientSince;
  let seq = nextSeq;

  if (stage === "Active Client" && !clientId) {
    clientId = formatClientId(seq);
    clientSince = today();
    seq += 1;
  }

  return {
    nextSeq: seq,
    record: {
      ...record,
      stage,
      clientId,
      clientSince,
      marketingEmailsOn: marketingShouldBeOn(stage),
      updatedAt: today(),
    },
  };
}

const STAGE_ORDER: Stage[] = ["Lead", "Active Pipeline", "Active Client"];

export function CrmProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [records, setRecords] = useState<RecordItem[]>(SEED_RECORDS);
  const [nextClientSeq, setNextClientSeq] = useState(INITIAL_NEXT_CLIENT_SEQ);
  const [selectedBrand, setSelectedBrand] = useState<BrandId | "ALL">("ALL");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AppState;
        setRecords(parsed.records);
        setNextClientSeq(parsed.nextClientSeq);
        setSelectedBrand(parsed.selectedBrand);
      }
    } catch {
      /* keep seed */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const state: AppState = { records, nextClientSeq, selectedBrand };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [records, nextClientSeq, selectedBrand, hydrated]);

  const setStage = useCallback((id: string, stage: Stage) => {
    setRecords((prev) => {
      let seq = nextClientSeq;
      const next = prev.map((r) => {
        if (r.id !== id) return r;
        const applied = applyStageRules(r, stage, seq);
        seq = applied.nextSeq;
        return applied.record;
      });
      setNextClientSeq(seq);
      return next;
    });
  }, [nextClientSeq]);

  const advanceStage = useCallback(
    (id: string) => {
      const record = records.find((r) => r.id === id);
      if (!record) return;
      const idx = STAGE_ORDER.indexOf(record.stage);
      if (idx < 0 || idx >= STAGE_ORDER.length - 1) return;
      setStage(id, STAGE_ORDER[idx + 1]);
    },
    [records, setStage],
  );

  const toggleService = useCallback((id: string, service: ServiceId) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const has = r.services.includes(service);
        return {
          ...r,
          services: has
            ? r.services.filter((s) => s !== service)
            : [...r.services, service],
          updatedAt: today(),
        };
      }),
    );
  }, []);

  const addLead = useCallback(
    (input: {
      company: string;
      contact: string;
      brandId: BrandId;
      owner: string;
    }) => {
      const item: RecordItem = {
        id: `r-${Date.now()}`,
        company: input.company,
        contact: input.contact,
        owner: input.owner,
        brandId: input.brandId,
        stage: "Lead",
        clientId: null,
        services: [],
        marketingEmailsOn: true,
        createdAt: today(),
        updatedAt: today(),
        clientSince: null,
      };
      setRecords((prev) => [item, ...prev]);
    },
    [],
  );

  const resetDemo = useCallback(() => {
    setRecords(SEED_RECORDS);
    setNextClientSeq(INITIAL_NEXT_CLIENT_SEQ);
    setSelectedBrand("ALL");
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      records,
      nextClientSeq,
      selectedBrand,
      hydrated,
      setSelectedBrand,
      advanceStage,
      setStage,
      toggleService,
      addLead,
      resetDemo,
    }),
    [
      records,
      nextClientSeq,
      selectedBrand,
      hydrated,
      advanceStage,
      setStage,
      toggleService,
      addLead,
      resetDemo,
    ],
  );

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>;
}

export function useCrm() {
  const ctx = useContext(CrmContext);
  if (!ctx) throw new Error("useCrm must be used within CrmProvider");
  return ctx;
}
