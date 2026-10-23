"use client";

import { Printer } from "lucide-react";
import { buttonStyles } from "@/components/ui/Button";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={buttonStyles({ className: "no-print" })}
    >
      <Printer className="h-4 w-4" aria-hidden="true" />
      Cetak / Simpan PDF
    </button>
  );
}
