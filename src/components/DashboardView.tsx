"use client";

import { EmailFlag, BrandPill, StagePill } from "@/components/ui";
import { filterByBrand, serviceName, stageCounts, winsByBrand, isolationHealth } from "@/lib/logic";
import { useCrm } from "@/lib/store";
import { SERVICES } from "@/lib/seed";

export function DashboardView() {
  const { records, selectedBrand } = useCrm();
  const scoped = filterByBrand(records, selectedBrand);
  const counts = stageCounts(scoped);
  const wins = winsByBrand(scoped);
  const health = isolationHealth(records);
  const clients = scoped.filter((r) => r.stage === "Active Client");
  const maxStage = Math.max(counts.Lead, counts["Active Pipeline"], counts["Active Client"], 1);
  const maxWin = Math.max(...wins.map((w) => w.count), 1);

  const serviceMix = SERVICES.map((s) => ({
    ...s,
    count: clients.filter((r) => r.services.includes(s.id)).length,
  }));
  const maxSvc = Math.max(...serviceMix.map((s) => s.count), 1);

  const hasXMissingY = clients.filter(
    (r) => r.services.includes("X") && !r.services.includes("Y"),
  ).length;

  return (
    <div className="page">
      <div className="section-head">
        <h1>Sales Command</h1>
        <p>
          Live snapshot for{" "}
          {selectedBrand === "ALL" ? "all brands" : `Brand ${selectedBrand}`}.
        </p>
      </div>

      <div className="kpi-row">
        <div className="kpi">
          <span className="kpi-label">Open leads</span>
          <strong>{counts.Lead}</strong>
        </div>
        <div className="kpi">
          <span className="kpi-label">Active pipeline</span>
          <strong>{counts["Active Pipeline"]}</strong>
        </div>
        <div className="kpi">
          <span className="kpi-label">Active clients</span>
          <strong>{counts["Active Client"]}</strong>
        </div>
        <div className="kpi">
          <span className="kpi-label">Isolation health</span>
          <strong>{health.crossBrandMatches}</strong>
          <em>cross-brand matches</em>
        </div>
      </div>

      <div className="grid-2">
        <section className="panel">
          <h2>Pipeline by stage</h2>
          {(
            [
              ["Lead", counts.Lead],
              ["Active Pipeline", counts["Active Pipeline"]],
              ["Active Client", counts["Active Client"]],
            ] as const
          ).map(([label, value]) => (
            <div className="bar-row" key={label}>
              <div className="bar-meta">
                <span>{label}</span>
                <span>{value}</span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: `${(value / maxStage) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </section>

        <section className="panel">
          <h2>Clients by brand</h2>
          {wins.map(({ brand, count }) => (
            <div className="bar-row" key={brand.id}>
              <div className="bar-meta">
                <span>{brand.name}</span>
                <span>{count}</span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill brand"
                  style={{
                    width: `${(count / maxWin) * 100}%`,
                    background: brand.color,
                  }}
                />
              </div>
            </div>
          ))}
        </section>
      </div>

      <div className="grid-2">
        <section className="panel">
          <h2>Service mix (Active Clients)</h2>
          {serviceMix.map((s) => (
            <div className="bar-row" key={s.id}>
              <div className="bar-meta">
                <span>{s.name}</span>
                <span>{s.count}</span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: `${(s.count / maxSvc) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </section>

        <section className="panel highlight">
          <h2>Inverted Cross-Sell</h2>
          <p className="panel-note">
            Has Retainer Mgmt · missing Paid Media
          </p>
          <div className="big-stat">{hasXMissingY}</div>
          <p className="panel-note">opportunities in current brand scope</p>
        </section>
      </div>

      <section className="panel">
        <h2>Recent activity</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Brand</th>
                <th>Stage</th>
                <th>Client ID</th>
                <th>Marketing</th>
                <th>Services</th>
              </tr>
            </thead>
            <tbody>
              {scoped.slice(0, 8).map((r) => (
                <tr key={r.id}>
                  <td>
                    <strong>{r.company}</strong>
                    <div className="muted">{r.contact}</div>
                  </td>
                  <td>
                    <BrandPill brandId={r.brandId} />
                  </td>
                  <td>
                    <StagePill stage={r.stage} />
                  </td>
                  <td className="mono">{r.clientId ?? "—"}</td>
                  <td>
                    <EmailFlag on={r.marketingEmailsOn} />
                  </td>
                  <td>
                    {r.services.length
                      ? r.services.map((s) => serviceName(s)).join(", ")
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
