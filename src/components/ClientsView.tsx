"use client";

import { BrandPill, EmailFlag } from "@/components/ui";
import { filterByBrand, serviceName } from "@/lib/logic";
import { SERVICES } from "@/lib/seed";
import { useCrm } from "@/lib/store";
import type { ServiceId } from "@/lib/types";

export function ClientsView() {
  const { records, selectedBrand, toggleService } = useCrm();
  const clients = filterByBrand(records, selectedBrand).filter(
    (r) => r.stage === "Active Client",
  );

  return (
    <div className="page">
      <div className="section-head">
        <h1>Client Master</h1>
        <p>
          Permanent Client IDs and lifetime service membership. Toggle services to
          feed inverted cross-sell search.
        </p>
      </div>

      <div className="client-grid">
        {clients.map((r) => (
          <article key={r.id} className="client-card">
            <header>
              <div>
                <div className="client-id">{r.clientId}</div>
                <h2>{r.company}</h2>
                <div className="muted">
                  {r.contact} · since {r.clientSince}
                </div>
              </div>
              <BrandPill brandId={r.brandId} />
            </header>
            <div className="client-row">
              <EmailFlag on={r.marketingEmailsOn} />
              <span className="muted">Owner {r.owner}</span>
            </div>
            <div className="service-toggles">
              {SERVICES.map((s) => {
                const on = r.services.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    className={on ? "chip on" : "chip"}
                    onClick={() => toggleService(r.id, s.id as ServiceId)}
                  >
                    {on ? "✓ " : ""}
                    {serviceName(s.id)}
                  </button>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
