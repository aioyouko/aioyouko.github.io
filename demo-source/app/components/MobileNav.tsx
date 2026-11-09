"use client";

import { useEffect, useRef } from "react";

type NavLink = { href: string; label: string; key: string };
export function MobileNav({ links, active }: { links: NavLink[]; active?: string }) {
  const menu = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    function dismiss(event: KeyboardEvent | PointerEvent) {
      if (event instanceof KeyboardEvent) {
        if (event.key === "Escape" && menu.current?.open) {
          menu.current.open = false;
          menu.current.querySelector("summary")?.focus();
        }
      } else if (event.target instanceof Node && !menu.current?.contains(event.target) && menu.current) {
        menu.current.open = false;
      }
    }
    document.addEventListener("keydown", dismiss);
    document.addEventListener("pointerdown", dismiss);
    return () => {
      document.removeEventListener("keydown", dismiss);
      document.removeEventListener("pointerdown", dismiss);
    };
  }, []);
  return <details className="mobile-menu" ref={menu}>
    <summary>Menu <span aria-hidden="true">＋</span></summary>
    <nav aria-label="Mobile navigation" onClick={event => {
      if ((event.target as HTMLElement).closest("a") && menu.current) menu.current.open = false;
    }}>
      {links.map(link => <a key={link.key} href={link.href} aria-current={active === link.key ? "page" : undefined}>{link.label}</a>)}
      <a href="/kanatzidis-demo/meetings">Group meetings</a>
      <a href="/kanatzidis-demo/contact">Contact & opportunities</a>
    </nav>
  </details>;
}
