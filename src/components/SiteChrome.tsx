import Link from "next/link";

const links = [
  { href: "/camps", label: "Camps & Events" },
  { href: "/parties", label: "Art Parties" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header({ current }: { current?: string }) {
  return (
    <>
      <div className="demo-banner">Demo site: sample prices, and no card is charged.</div>
      <header className="site-header">
        <div className="wrap">
          <Link href="/" className="logo">
            <img src="/images/logo.jpg" alt="Sunbeam Art House" width={92} height={92} />
          </Link>
          <nav className="nav" aria-label="Main">
            {links.map((l) => (
              <Link key={l.href} href={l.href} aria-current={current === l.href ? "page" : undefined}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <span className="brand">Sunbeam Art House</span>
        <div className="links">
          <Link href="/contact">Contact us</Link>
          <a href="#">Instagram</a>
          <a href="#">Facebook</a>
        </div>
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
