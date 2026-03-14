"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Aperture } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import type { Category } from "@/lib/types";

interface HeaderProps {
  siteName: string;
  categories: Category[];
}

export default function Header({ siteName, categories }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  function scrollToHash(hash: string) {
    setMobileOpen(false);
    setDropdownOpen(false);
    if (pathname === "/") {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/#${hash}`);
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  const navLinkClass =
    "text-xs tracking-[0.12em] uppercase text-neutral-500 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors duration-300";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#161615]/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-700/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="font-display text-lg tracking-[0.08em] uppercase font-light flex items-center gap-2 text-neutral-900 dark:text-neutral-100"
          >
            <Aperture size={20} strokeWidth={1.5} />
            {siteName}
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {/* Portfolio dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onMouseEnter={() => setDropdownOpen(true)}
                className={`${navLinkClass} flex items-center gap-1`}
              >
                Categories
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div
                  onMouseLeave={() => setDropdownOpen(false)}
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-3"
                >
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg py-2 min-w-[200px] animate-fadeIn">
                    {sortedCategories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/${cat.slug}`}
                        onClick={() => setDropdownOpen(false)}
                        className="block px-5 py-2.5 text-xs tracking-[0.1em] uppercase text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => scrollToHash("about")} className={navLinkClass}>
              About
            </button>
            <button onClick={() => scrollToHash("contact")} className={navLinkClass}>
              Contact
            </button>
            <ThemeToggle />
          </nav>

          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(true)}
              className="p-1"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[200] bg-white dark:bg-neutral-950 flex flex-col items-center justify-center gap-6 animate-fadeIn">
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-5 right-5 p-1"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>

          <span className="text-xs tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500 mb-1">
            Categories
          </span>
          {sortedCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/${cat.slug}`}
              onClick={() => setMobileOpen(false)}
              className="font-display text-2xl font-light tracking-wide"
            >
              {cat.name}
            </Link>
          ))}

          <div className="w-12 border-t border-neutral-200 dark:border-neutral-800 my-2" />

          <button
            onClick={() => scrollToHash("about")}
            className="font-display text-2xl font-light tracking-wide"
          >
            About
          </button>
          <button
            onClick={() => scrollToHash("contact")}
            className="font-display text-2xl font-light tracking-wide"
          >
            Contact
          </button>
        </div>
      )}
    </>
  );
}
