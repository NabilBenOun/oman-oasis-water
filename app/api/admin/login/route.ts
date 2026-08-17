import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_DURATION, createAdminSession } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { username?: string; password?: string } | null;
  const username = process.env.ADMIN_USERNAME ?? (process.env.NODE_ENV === "production" ? "" : "admin");
  const password = process.env.ADMIN_PASSWORD ?? (process.env.NODE_ENV === "production" ? "" : "Oasis2026!");

  if (!username || !password) {
    return NextResponse.json({ message: "لم يتم إعداد بيانات دخول المدير." }, { status: 503 });
  }

  if (body?.username !== username || body?.password !== password) {
    return NextResponse.json({ message: "اسم المستخدم أو كلمة المرور غير صحيحة." }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, await createAdminSession(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_DURATION,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return NextResponse.json({ ok: true });
}
