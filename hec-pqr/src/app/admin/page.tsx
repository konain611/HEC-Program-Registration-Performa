import { Suspense } from "react";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { ADMIN_SESSION_COOKIE, isAdminConfigured, isValidAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { documents } from "@/components/registration/sections";

const programFields = [
  ["HEI name", "heiName"],
  ["Campus", "campusName"],
  ["Department", "departmentName"],
  ["Qualification level", "qualificationLevel"],
  ["Program equivalent", "programEquivalent"],
  ["Degree abbreviation", "degreeAbbreviation"],
  ["Eligibility criteria", "eligibilityCriteria"],
  ["Accreditation status", "accreditationStatus"],
  ["Field of study", "fieldOfStudy"],
  ["Subject", "subject"],
  ["Education system", "educationSystem"],
  ["Mode of study", "modeOfStudy"],
  ["Session type", "sessionType"],
  ["Credit hours", "creditHours"],
  ["Program duration", "programDuration"],
  ["Semesters / terms", "semesterCount"],
  ["Area of specialization", "areaOfSpecialization"],
  ["Other specialization", "otherSpecialization"],
  ["Minimum duration", "minimumDuration"],
  ["Maximum duration", "maximumDuration"],
  ["Degree start date", "degreeStartDate"],
  ["Degree end date", "degreeEndDate"],
  ["Current program", "isCurrent"],
  ["Recognition date", "recognitionDate"],
  ["HEC NOC obtained", "nocObtained"],
] as const;

function formatValue(value: string | number | boolean | Date) {
  if (value instanceof Date) return value.toLocaleDateString("en-PK", { timeZone: "UTC" });
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

function getDocumentStatus(statuses: unknown, index: number) {
  if (typeof statuses !== "object" || statuses === null || Array.isArray(statuses)) return "—";
  const status = Object.entries(statuses).find(([key]) => key === `document-${index}`)?.[1];
  return typeof status === "string" ? status : "—";
}

async function AdminContent({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    confirmDelete?: string;
    deleteError?: string;
    deleted?: string;
  }>;
}) {
  await connection();
  const [cookieStore, params] = await Promise.all([cookies(), searchParams]);
  const authenticated = isValidAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);

  if (!authenticated) {
    const configured = isAdminConfigured();
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7f6] px-4 py-12">
        <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#28785f]">
            Program Quality Registry
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-950">Admin sign in</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Sign in to view submitted program registrations.
          </p>

          {!configured ? (
            <p className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-800">
              Admin login is not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD in the server environment.
            </p>
          ) : (
            <>
              {params.error === "credentials" && (
                <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-800" role="alert">
                  The email or password is incorrect.
                </p>
              )}
              {params.error === "config" && (
                <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-800" role="alert">
                  Admin login is not configured on the server.
                </p>
              )}
              <form className="mt-6 space-y-4" method="post" action="/admin/login">
                <div>
                  <label className="block text-sm font-medium text-slate-700" htmlFor="admin-email">
                    Email
                  </label>
                  <input
                    className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#349c7d] focus:ring-2 focus:ring-[#349c7d]/20"
                    id="admin-email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700" htmlFor="admin-password">
                    Password
                  </label>
                  <input
                    className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#349c7d] focus:ring-2 focus:ring-[#349c7d]/20"
                    id="admin-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                  />
                </div>
                <button
                  className="w-full rounded-lg bg-[#28785f] px-4 py-3 text-sm font-semibold text-white hover:bg-[#22634f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#28785f]"
                  type="submit"
                >
                  Sign in
                </button>
              </form>
            </>
          )}
        </section>
      </main>
    );
  }

  const registrations = await prisma.programRegistration.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-[#f5f7f6] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#28785f]">
              Program Quality Registry
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Program registrations
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {registrations.length} {registrations.length === 1 ? "submission" : "submissions"}
            </p>
          </div>
          <form method="post" action="/admin/logout">
            <button
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              type="submit"
            >
              Sign out
            </button>
          </form>
        </header>

        {params.deleted === "1" && (
          <p className="mb-5 rounded-lg border border-[#cce4d9] bg-[#edf6f1] p-4 text-sm text-[#285c4d]" role="status">
            Registration deleted.
          </p>
        )}
        {params.deleteError && (
          <p className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
            {params.deleteError === "missing"
              ? "That registration no longer exists."
              : "The registration could not be deleted. Please try again."}
          </p>
        )}

        {registrations.length === 0 ? (
          <section className="rounded-xl border border-slate-200 bg-white p-10 text-center">
            <h2 className="text-lg font-semibold text-slate-900">No registrations yet</h2>
            <p className="mt-2 text-sm text-slate-600">Submitted forms will appear here.</p>
          </section>
        ) : (
          <div className="space-y-6">
            {registrations.map((registration, index) => (
              <details
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                key={registration.id}
                open={params.confirmDelete === registration.id}
              >
                <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#28785f] sm:px-7 [&::-webkit-details-marker]:hidden">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#28785f]">
                      Submission {registrations.length - index}
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-slate-900">
                      {registration.heiName} — {registration.degreeAbbreviation}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Submitted {formatValue(registration.createdAt)}
                    </p>
                  </div>
                  <span className="flex items-center gap-3">
                    <span className="rounded-full bg-[#e8f4ef] px-3 py-1 text-sm font-medium text-[#24634f]">
                      {registration.isCurrent ? "Current program" : "Not current"}
                    </span>
                    <span aria-hidden="true" className="text-xl text-slate-500">⌄</span>
                  </span>
                </summary>

                <div className="p-5 sm:p-7">
                  {params.confirmDelete === registration.id && (
                    <section
                      aria-labelledby={`delete-confirmation-${registration.id}`}
                      className="mb-7 rounded-lg border border-red-200 bg-red-50 p-4 sm:p-5"
                    >
                      <h3
                        className="font-semibold text-red-900"
                        id={`delete-confirmation-${registration.id}`}
                      >
                        Confirm permanent deletion
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-red-800">
                        Delete the registration for {registration.heiName} ({registration.degreeAbbreviation})?
                        This cannot be undone.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <form action="/admin/delete" method="post">
                          <input name="id" type="hidden" value={registration.id} />
                          <input name="confirmation" type="hidden" value="yes" />
                          <button
                            className="rounded-lg bg-red-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                            type="submit"
                          >
                            Yes, permanently delete
                          </button>
                        </form>
                        <a
                          className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                          href="/admin"
                        >
                          Cancel
                        </a>
                      </div>
                    </section>
                  )}

                  {params.confirmDelete !== registration.id && (
                    <form action="/admin/delete" className="mb-7" method="post">
                      <input name="id" type="hidden" value={registration.id} />
                      <button
                        className="rounded-lg border border-red-300 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                        type="submit"
                      >
                        Delete record
                      </button>
                    </form>
                  )}

                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                    Program details
                  </h3>
                  <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                    {programFields.map(([label, key]) => (
                      <div className="min-w-0" key={key}>
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
                        <dd className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-900">
                          {formatValue(registration[key])}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-7 border-t border-slate-200 pt-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                      Document checklist
                    </h3>
                    <dl className="mt-4 divide-y divide-slate-100">
                      {documents.map((document, documentIndex) => (
                        <div
                          className="flex flex-wrap items-start justify-between gap-2 py-3"
                          key={document}
                        >
                          <dt className="max-w-3xl text-sm leading-6 text-slate-700">{document}</dt>
                          <dd className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-800">
                            {getDocumentStatus(registration.documentStatuses, documentIndex)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    confirmDelete?: string;
    deleteError?: string;
    deleted?: string;
  }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#f5f7f6] px-4">
          <p className="text-sm font-medium text-slate-600">Loading admin page...</p>
        </main>
      }
    >
      <AdminContent searchParams={searchParams} />
    </Suspense>
  );
}
