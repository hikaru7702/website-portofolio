import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * CV tersedia sebagai halaman yang siap dicetak ke PDF di /cv.
 * Endpoint ini dipertahankan agar tautan lama tetap berfungsi.
 */
export async function GET(request: Request) {
  return NextResponse.redirect(new URL("/cv", request.url), 308);
}
