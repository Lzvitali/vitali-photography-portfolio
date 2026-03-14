"use client";

import { useEffect, useState } from "react";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const isDev =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    setAllowed(isDev);
  }, []);

  if (allowed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-neutral-400">Loading...</div>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-neutral-500">
            Admin panel is only available in development mode.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
