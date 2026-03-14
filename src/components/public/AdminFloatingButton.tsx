"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Settings } from "lucide-react";

export default function AdminFloatingButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const host = window.location.hostname;
    setVisible(host === "localhost" || host === "127.0.0.1");
  }, []);

  if (!visible) return null;

  return (
    <Link
      href="/admin"
      className="fixed bottom-5 right-5 z-[100] w-11 h-11 rounded-full
        bg-neutral-900 dark:bg-white text-white dark:text-neutral-900
        flex items-center justify-center shadow-lg
        hover:scale-110 active:scale-95 transition-transform duration-200"
      aria-label="Open admin panel"
      title="Admin Panel"
    >
      <Settings size={18} />
    </Link>
  );
}
