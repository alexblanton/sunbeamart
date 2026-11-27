import Link from "next/link";
import { MainNav } from "./MainNav";

export function Header({ current }: { current?: string }) {
  return (
    <>
      <div className="demo-banner">Demo site: sample prices, and no card is charged.</div>
      <header className="site-header">
        <div className="wrap">
          <Link href="/" className="logo" aria-label="Sunbeam Art House home">
            <img src="/images/logo.jpg" alt="Sunbeam Art House" width={92} height={92} />
            <span className="logo-name">Sunbeam Art House</span>
          </Link>
          <MainNav current={current} />
        </div>
      </header>
    </>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div>
          <span className="brand">Sunbeam Art House</span>
          <p className="footer-tag">Creative sunshine for your soul.</p>
        </div>
        <nav className="links" aria-label="Footer">
          <Link href="/camps">Camps &amp; Events</Link>
          <Link href="/parties">Art Parties</Link>
          <Link href="/contact">Contact us</Link>
          <a href="#">Instagram</a>
          <a href="#">Facebook</a>
        </nav>
      </div>
    </footer>
  );
}

export function Page({ current, children }: { current?: string; children: React.ReactNode }) {
  return (
    <>
      <Header current={current} />
      {children}
      <Footer />
    </>
  );
}
