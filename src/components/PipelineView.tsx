"use client";

import { useState } from "react";
import { BrandPill, EmailFlag, StagePill } from "@/components/ui";
import { filterByBrand } from "@/lib/logic";
import { BRANDS, OWNERS } from "@/lib/seed";
import { useCrm } from "@/lib/store";
import type { BrandId, Stage } from "@/lib/types";

const STAGES: Stage[] = ["Lead", "Active Pipeline", "Active Client"];

export function PipelineView() {
  const { records, selectedBrand, setStage, advanceStage, addLead } = useCrm();
  const scoped = filterByBrand(records, selectedBrand);
  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");
  const [brandId, setBrandId] = useState<BrandId>("A");
  const [owner, setOwner] = useState(OWNERS[0]);

  function onAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!company.trim() || !contact.trim()) return;
    addLead({ company: company.trim(), contact: contact.trim(), brandId, owner });
    setCompany("");
    setContact("");
  }

  return (
    <div className="page">
      <div className="section-head">
        <h1>Pipeline</h1>
        <p>
          Lead → Active Pipeline → Active Client. Moving to pipeline turns marketing
          emails off. Becoming a client issues a permanent Client ID.
        </p>
      </div>

      <form className="add-form" onSubmit={onAdd}>
        <input
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <input
          placeholder="Contact"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
        <select value={brandId} onChange={(e) => setBrandId(e.target.value as BrandId)}>
          {BRANDS.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        <select value={owner} onChange={(e) => setOwner(e.target.value)}>
          {OWNERS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <button type="submit" className="primary-btn">
          Add lead
        </button>
      </form>

      <div className="kanban">
        {STAGES.map((stage) => {
          const items = scoped.filter((r) => r.stage === stage);
          return (
            <section key={stage} className="kanban-col">
              <header>
                <h2>{stage}</h2>
                <span>{items.length}</span>
              </header>
              <div className="kanban-list">
                {items.map((r) => (
                  <article key={r.id} className="deal-card">
                    <div className="deal-top">
                      <strong>{r.company}</strong>
                      <BrandPill brandId={r.brandId} />
                    </div>
                    <div className="muted">{r.contact} · {r.owner}</div>
                    <div className="deal-meta">
                      <EmailFlag on={r.marketingEmailsOn} />
                      {r.clientId ? (
                        <span className="mono">{r.clientId}</span>
                      ) : null}
                    </div>
                    <div className="deal-actions">
                      <select
                        value={r.stage}
                        onChange={(e) => setStage(r.id, e.target.value as Stage)}
                        aria-label={`Stage for ${r.company}`}
                      >
                        {STAGES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      {r.stage !== "Active Client" ? (
                        <button
                          type="button"
                          className="primary-btn small"
                          onClick={() => advanceStage(r.id)}
                        >
                          Advance →
                        </button>
                      ) : (
                        <StagePill stage={r.stage} />
                      )}
                    </div>
                  </article>
                ))}
                {!items.length ? (
                  <p className="empty">No records in this stage.</p>
                ) : null}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
