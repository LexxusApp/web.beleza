"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { SearchBar } from "./SearchBar";

const navLinks = [
  { href: "#maquiagem", label: "Maquiagem" },
  { href: "#skincare", label: "Skincare" },
  { href: "#perfumaria", label: "Perfumaria" },
  { href: "#novidades", label: "Novidades" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { openCart, totalItems } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-cream/95 backdrop-blur-md shadow-sm border-b border-ink/5"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-ink/5 lg:hidden"
            aria-label="Abrir menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>

          <Link
            href="/"
            className={`font-display text-xl tracking-[0.2em] sm:text-2xl ${
              scrolled ? "text-ink" : "text-white drop-shadow-md"
            }`}
          >
            LUMIÈRE
          </Link>

          <ul className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`text-xs font-medium uppercase tracking-widest transition-colors hover:text-gold ${
                    scrolled ? "text-ink/80" : "text-white/90"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors hover:bg-ink/5 ${
                scrolled ? "text-ink" : "text-white"
              }`}
              aria-label="Buscar"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" />
              </svg>
            </button>

            <button
              type="button"
              onClick={openCart}
              className={`relative flex h-12 w-12 items-center justify-center rounded-full transition-colors hover:bg-ink/5 ${
                scrolled ? "text-ink" : "text-white"
              }`}
              aria-label={`Carrinho, ${totalItems} itens`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9Z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-ink">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </nav>

        {searchOpen && (
          <div className="border-t border-ink/5 bg-cream/98 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8">
            <SearchBar onClose={() => setSearchOpen(false)} autoFocus />
          </div>
        )}
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/50 animate-fade-in"
            onClick={() => setMenuOpen(false)}
            aria-label="Fechar menu"
          />
          <aside className="absolute left-0 top-0 bottom-0 w-[min(85vw,320px)] bg-cream animate-slide-in-right shadow-2xl">
            <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
              <span className="font-display text-lg tracking-widest">Menu</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex h-12 w-12 items-center justify-center rounded-full hover:bg-ink/5"
                aria-label="Fechar menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col p-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-[52px] items-center rounded-lg px-4 text-sm font-medium uppercase tracking-widest text-ink/80 transition-colors hover:bg-blush active:bg-blush"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="border-t border-ink/10 p-4">
              <SearchBar onClose={() => setMenuOpen(false)} />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

