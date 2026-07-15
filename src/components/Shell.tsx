"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRANDS } from "@/lib/seed";
import { useCrm } from "@/lib/store";
import type { BrandId } from "@/lib/types";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/pipeline", label: "Pipeline" },
  { href: "/clients", label: "Clients" },
  { href: "/search", label: "Cross-Sell" },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { selectedBrand, setSelectedBrand, resetDemo } = useCrm();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-left">
          <Link href="/" className="brand-mark">
            <span className="brand-word">Boardroom</span>
            <span className="brand-sub">Multi-Brand CRM</span>
          </Link>
          <nav className="nav">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={pathname === item.href ? "nav-link active" : "nav-link"}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="topbar-right">
          <label className="brand-filter">
            <span>Brand scope</span>
            <select
              value={selectedBrand}
              onChange={(e) =>
                setSelectedBrand(e.target.value as BrandId | "ALL")
              }
            >
              <option value="ALL">All brands</option>
              {BRANDS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="ghost-btn" onClick={resetDemo}>
            Reset demo
          </button>
        </div>
      </header>
      <div className="demo-ribbon">
        Interactive MVP — brand isolation, stage automations, Client IDs, inverted
        cross-sell search. Data saves in this browser.
      </div>
      <main className="main">{children}</main>
    </div>
  );
}
