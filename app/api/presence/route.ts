import { NextRequest, NextResponse } from "next/server";

export type VisitorStep = "browsing" | "delivery" | "personal_info" | "entering_otp";

interface VisitorSession {
  visitorId: string;
  step: VisitorStep;
  lastActive: number;
}

declare global {
  var __presenceStore: Map<string, VisitorSession> | undefined;
}

function getStore(): Map<string, VisitorSession> {
  if (!globalThis.__presenceStore) {
    globalThis.__presenceStore = new Map<string, VisitorSession>();
  }
  return globalThis.__presenceStore;
}

const STALE_TIMEOUT_MS = 12000;

function purgeStale(store: Map<string, VisitorSession>) {
  const now = Date.now();
  for (const [id, session] of store.entries()) {
    if (now - session.lastActive > STALE_TIMEOUT_MS) {
      store.delete(id);
    }
  }
}

function calculateMetrics(store: Map<string, VisitorSession>) {
  purgeStale(store);
  let onlineVisitors = 0;
  let fillingDelivery = 0;
  let fillingPersonal = 0;
  let enteringOtp = 0;

  for (const session of store.values()) {
    onlineVisitors++;
    if (session.step === "delivery") fillingDelivery++;
    else if (session.step === "personal_info") fillingPersonal++;
    else if (session.step === "entering_otp") enteringOtp++;
  }

  return {
    onlineVisitors,
    fillingDelivery,
    fillingPersonal,
    enteringOtp,
    totalSessions: store.size,
  };
}

export async function GET() {
  const store = getStore();
  const metrics = calculateMetrics(store);
  return NextResponse.json(metrics);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { visitorId, step } = body as { visitorId?: string; step?: VisitorStep };

    if (visitorId) {
      const store = getStore();
      store.set(visitorId, {
        visitorId,
        step: step || "browsing",
        lastActive: Date.now(),
      });
    }

    const metrics = calculateMetrics(getStore());
    return NextResponse.json(metrics);
  } catch {
    const metrics = calculateMetrics(getStore());
    return NextResponse.json(metrics);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    let visitorId: string | null = null;
    try {
      const body = await req.json();
      visitorId = body?.visitorId ?? null;
    } catch {
      // payload might come from search params or text
    }
    if (!visitorId) {
      visitorId = req.nextUrl.searchParams.get("visitorId");
    }

    if (visitorId) {
      const store = getStore();
      store.delete(visitorId);
    }
    const metrics = calculateMetrics(getStore());
    return NextResponse.json(metrics);
  } catch {
    return NextResponse.json({ ok: true });
  }
}
