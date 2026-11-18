import { NextResponse } from "next/server";

import { GatewayRequestError } from "@/services/GatewayRequestError";
import { apiClient } from "@/services/GatewayServerClient";

interface RouteContext {
  params: Promise<{ personId: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { personId } = await params;

  if (!/^\d+$/.test(personId)) {
    return new NextResponse(null, { status: 400 });
  }

  try {
    const upstream = await apiClient.GET_BLOB(`beneficiaries/persons/${personId}/photo`);
    const headers = new Headers({
      "Content-Type": upstream.headers.get("content-type") ?? "image/jpeg",
      "Cache-Control": "no-store, no-cache, must-revalidate, private",
      Pragma: "no-cache",
      Expires: "0",
    });

    return new NextResponse(await upstream.arrayBuffer(), { status: 200, headers });
  } catch (error) {
    const status = error instanceof GatewayRequestError ? error.status : 502;

    return NextResponse.json({ error: true, message: "No se pudo obtener la foto." }, { status });
  }
}
