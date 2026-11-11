import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

function adminRedirect(request: Request, params: Record<string, string>) {
  const url = new URL("/admin", request.url);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return NextResponse.redirect(url, 303);
}

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const cookieStore = await cookies();
  if (!isValidAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)) {
    return adminRedirect(request, {});
  }

  const formData = await request.formData();
  const id = formData.get("id");
  if (typeof id !== "string" || id.length === 0) {
    return adminRedirect(request, { deleteError: "missing" });
  }

  if (formData.get("confirmation") !== "yes") {
    const registration = await prisma.programRegistration.findUnique({
      where: { id },
      select: { id: true },
    });
    return registration
      ? adminRedirect(request, { confirmDelete: id })
      : adminRedirect(request, { deleteError: "missing" });
  }

  try {
    await prisma.programRegistration.delete({ where: { id } });
    return adminRedirect(request, { deleted: "1" });
  } catch (error) {
    console.error("Failed to delete program registration.", error);
    return adminRedirect(request, { deleteError: "failed" });
  }
}
