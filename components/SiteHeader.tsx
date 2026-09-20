"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/reading-materials", label: "Reading Materials" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isTeacherArea = pathname.startsWith("/teacher");

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-primary/10 bg-hero/90 backdrop-blur-md">
      <div className="mx-auto flex min-h-[4.75rem] max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:gap-3"
        >
          <Image
            src="/school-logo.png"
            alt="Maugat East Elementary School logo"
            width={56}
            height={56}
            className="h-11 w-11 shrink-0 object-contain sm:h-14 sm:w-14"
            priority
          />
          <span className="min-w-0">
            <span className="block truncate font-display text-sm font-semibold leading-tight text-foreground sm:text-base md:text-lg">
              Maugat East Elementary School
            </span>
            <span className="mt-0.5 block truncate text-[11px] leading-snug text-muted sm:text-xs">
              Maugat East, Padre Garcia, Batangas
            </span>
          </span>
        </Link>

        {!isTeacherArea ? (
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <nav
              className="mr-1 hidden items-center gap-1 md:flex"
              aria-label="Main"
            >
              {navLinks.map((link) => {
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname === link.href ||
                      pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-2 text-sm font-semibold transition ${
                      active
                        ? "text-primary"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        ) : (
          <p className="text-sm font-semibold text-primary">Teacher area</p>
        )}
      </div>

      {open && !isTeacherArea ? (
        <div className="border-t border-primary/10 bg-hero px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-2" aria-label="Mobile">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-2xl px-4 py-3 text-base font-semibold text-foreground hover:bg-primary-soft"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
