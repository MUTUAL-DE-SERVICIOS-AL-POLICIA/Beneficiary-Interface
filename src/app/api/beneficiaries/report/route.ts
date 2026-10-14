import { NextResponse } from "next/server";

import { GatewayRequestError } from "@/services/GatewayRequestError";
import { apiClient } from "@/services/GatewayServerClient";

export async function GET(request: Request) {
  const input = new URL(request.url).searchParams;
  const dateFrom = input.get("dateFrom") ?? "";
  const dateTo = input.get("dateTo") ?? "";

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateFrom) || !/^\d{4}-\d{2}-\d{2}$/.test(dateTo)) {
    return new NextResponse(null, { status: 400 });
  }

  try {
    const query = new URLSearchParams({ dateFrom, dateTo });
    const upstream = await apiClient.GET_BLOB(`beneficiaries/reports/registerFingerprints?${query}`);
    const headers = new Headers({
      "Content-Type": upstream.headers.get("content-type") ?? "text/csv; charset=utf-8",
      "Cache-Control": "no-store",
      Pragma: "no-cache",
    });
    const disposition = upstream.headers.get("content-disposition");

    if (disposition) headers.set("Content-Disposition", disposition);

    return new NextResponse(await upstream.arrayBuffer(), { status: 200, headers });
  } catch (error) {
    const status = error instanceof GatewayRequestError ? error.status : 502;

    return NextResponse.json({ error: true, message: "No se pudo generar el reporte." }, { status });
  }
}
