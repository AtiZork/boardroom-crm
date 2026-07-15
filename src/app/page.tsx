import Link from "next/link";

export default function HomePage() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <Link href="/" className="brand-mark">
          <span className="brand-word">Boardroom</span>
          <span className="brand-sub">Multi-Brand CRM</span>
        </Link>
        <Link href="/dashboard" className="primary-btn">
          Open live demo
        </Link>
      </nav>

      <section className="landing-hero">
        <div className="eyebrow">Interactive MVP</div>
        <h1>Boardroom</h1>
        <p className="lede">
          A working model of your multi-brand CRM: isolated brands, stage-based
          email cutoff, permanent Client IDs, inverted service search, and
          executive dashboards — ready to explore before SmartSuite build-out.
        </p>
        <div className="landing-cta">
          <Link href="/dashboard" className="primary-btn">
            Explore dashboards
          </Link>
          <Link href="/pipeline" className="ghost-btn">
            Try pipeline stages
          </Link>
        </div>

        <div className="landing-proof">
          <div className="proof-item">
            <strong>4 brands</strong>
            <span>Scoped records and marketing — no cross-brand messaging.</span>
          </div>
          <div className="proof-item">
            <strong>Client IDs</strong>
            <span>CL-8492 style IDs issued once at Active Client.</span>
          </div>
          <div className="proof-item">
            <strong>Cross-sell</strong>
            <span>“Has X, missing Y” inverted filters on live data.</span>
          </div>
          <div className="proof-item">
            <strong>Dashboards</strong>
            <span>Pipeline, brand wins, service mix, isolation health.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
