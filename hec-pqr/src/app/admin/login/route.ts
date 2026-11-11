import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSession,
  isAdminConfigured,
  verifyAdminCredentials,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectUrl = new URL("/admin", request.url);

  if (!isAdminConfigured()) {
    redirectUrl.searchParams.set("error", "config");
    return NextResponse.redirect(redirectUrl, 303);
  }

  if (typeof email !== "string" || typeof password !== "string" || !verifyAdminCredentials(email, password)) {
    redirectUrl.searchParams.set("error", "credentials");
    return NextResponse.redirect(redirectUrl, 303);
  }

  const { token, maxAge } = createAdminSession();
  const response = NextResponse.redirect(redirectUrl, 303);
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
