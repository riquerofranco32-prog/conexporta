"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollRestorer() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
