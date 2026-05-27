"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  Zap,
  LayoutDashboard,
  Upload,
  History,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/upload", label: "Analyze", icon: Upload },
  { href: "/history", label: "History", icon: History },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Detect scroll for navbar shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const avatarLetter = user?.username?.[0]?.toUpperCase() ?? "U";

  return (
    <header
      className={cn(
        "sticky top-0 z-40",
        "border-b border-white/8 dark:border-white/5",
        "bg-white/80 dark:bg-white/[0.04] backdrop-blur-2xl",
        "transition-shadow duration-200",
        scrolled &&
          "shadow-[0_4px_24px_hsl(228_30%_4%/0.08)] dark:shadow-[0_4px_24px_hsl(228_30%_4%/0.3)]"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/dashboard" className="group flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 shadow-[0_0_12px_hsl(243_75%_59%/0.4)] transition-shadow group-hover:shadow-[0_0_20px_hsl(243_75%_59%/0.6)]">
            <Zap size={15} className="text-white" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-foreground">
            ResumeIQ
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-150",
                  isActive
                    ? "text-brand-400"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-lg bg-brand-500/10"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <link.icon size={14} className="relative" />
                <span className="relative">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* User menu */}
          <div className="relative" ref={menuRef}>
            <button
              id="user-menu-btn"
              type="button"
              onClick={() => setMenuOpen((p) => !p)}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 transition-colors",
                menuOpen
                  ? "bg-muted/80"
                  : "hover:bg-muted/50"
              )}
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >
              {/* Avatar */}
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-violet-600 text-xs font-bold text-white shadow-[0_0_8px_hsl(243_75%_59%/0.35)]">
                {avatarLetter}
              </div>
              <span className="hidden text-sm font-medium text-foreground sm:block">
                {user?.username}
              </span>
              <ChevronDown
                size={13}
                className={cn(
                  "text-muted-foreground transition-transform duration-200",
                  menuOpen && "rotate-180"
                )}
              />
            </button>

            {/* Dropdown */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl",
                    "border border-border/60 bg-card/95 backdrop-blur-xl",
                    "shadow-[0_8px_32px_hsl(228_30%_4%/0.18)] dark:shadow-[0_8px_32px_hsl(228_30%_4%/0.5)]"
                  )}
                  role="menu"
                >
                  {/* User info */}
                  <div className="border-b border-border/60 px-4 py-3">
                    <p className="text-xs text-muted-foreground">Signed in as</p>
                    <p className="truncate text-sm font-semibold text-foreground">
                      {user?.email}
                    </p>
                  </div>

                  <div className="p-1.5">
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      role="menuitem"
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                    >
                      <User size={13} />
                      Profile
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                      }}
                      role="menuitem"
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/8 hover:text-red-300"
                    >
                      <LogOut size={13} />
                      Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="flex gap-1 px-4 pb-3 md:hidden">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-lg py-2 text-xs font-medium transition-colors",
                isActive
                  ? "bg-brand-500/10 text-brand-400"
                  : "text-muted-foreground"
              )}
            >
              <link.icon size={16} />
              {link.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
