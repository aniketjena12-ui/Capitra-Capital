import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Endpoint deprecated. KYC documents are now uploaded directly via /api/kyc." },
    { status: 410 }
  );
}
