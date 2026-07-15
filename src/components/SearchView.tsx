"use client";

import { useMemo, useState } from "react";
import { BrandPill } from "@/components/ui";
import { filterByBrand, invertedCrossSell, serviceName } from "@/lib/logic";
import { SERVICES } from "@/lib/seed";
import { useCrm } from "@/lib/store";
import type { ServiceId } from "@/lib/types";

export function SearchView() {
  const { records, selectedBrand } = useCrm();
  const [include, setInclude] = useState<ServiceId | "">("X");
  const [exclude, setExclude] = useState<ServiceId | "">("Y");

  const scoped = filterByBrand(records, selectedBrand);
  const results = useMemo(
    () =>
      invertedCrossSell(
        scoped,
        include || null,
        exclude || null,
      ),
    [scoped, include, exclude],
  );

  return (
    <div className="page">
      <div className="section-head">
        <h1>Inverted Cross-Sell Search</h1>
        <p>
          Show Active Clients who have one service and do not have another — e.g.
          Retainer Mgmt yes, Paid Media no.
        </p>
      </div>

      <div className="search-bar">
        <label>
          Has service
          <select
            value={include}
            onChange={(e) => setInclude(e.target.value as ServiceId | "")}
          >
            <option value="">Any</option>
            {SERVICES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Missing service
          <select
            value={exclude}
            onChange={(e) => setExclude(e.target.value as ServiceId | "")}
          >
            <option value="">Any</option>
            {SERVICES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <div className="search-count">
          <strong>{results.length}</strong>
          <span>matches</span>
        </div>
      </div>

      <section className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Client ID</th>
                <th>Client</th>
                <th>Brand</th>
                <th>Services</th>
                <th>Owner</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id}>
                  <td className="mono">{r.clientId}</td>
                  <td>
                    <strong>{r.company}</strong>
                    <div className="muted">{r.contact}</div>
                  </td>
                  <td>
                    <BrandPill brandId={r.brandId} />
                  </td>
                  <td>
                    {r.services.map((s) => serviceName(s)).join(" · ") || "—"}
                  </td>
                  <td>{r.owner}</td>
                </tr>
              ))}
              {!results.length ? (
                <tr>
                  <td colSpan={5} className="empty">
                    No clients match this filter in the current brand scope.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
