import Image from "next/image";
import type { ReactNode } from "react";
import { documents } from "./sections";

export type PreviewData = Record<string, string>;

const institutionFields: [string, string][] = [
  ["Name of HEI", "heiName"],
  ["Campus name", "campusName"],
  ["Department name", "departmentName"],
  ["Qualification level", "qualificationLevel"],
  ["Program equivalent", "programEquivalent"],
  ["Degree abbreviation", "degreeAbbreviation"],
  ["Eligibility criteria", "eligibilityCriteria"],
  ["Accreditation status", "accreditationStatus"],
  ["Field of study", "fieldOfStudy"],
  ["Subject", "subject"],
];

const studyFields: [string, string][] = [
  ["Education system", "educationSystem"],
  ["Mode of study", "modeOfStudy"],
  ["Session type", "sessionType"],
  ["Credit hours", "creditHours"],
  ["Program duration", "programDuration"],
  ["Number of semesters / terms", "semesterCount"],
  ["Area of specialization", "areaOfSpecialization"],
  ["Other area of specialization", "otherSpecialization"],
  ["Degree minimum duration", "minimumDuration"],
  ["Degree maximum duration", "maximumDuration"],
  ["Degree start date", "degreeStartDate"],
  ["Degree end date", "degreeEndDate"],
  ["Is this program current?", "isCurrent"],
  ["Program recognition date", "recognitionDate"],
  ["NOC obtained from HEC", "nocObtained"],
];

function getValue(data: PreviewData, key: string) {
  const value = data[key]?.trim();
  if (!value) return "—";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value))
    return new Date(`${value}T00:00:00`).toLocaleDateString();
  return value;
}

function FieldTable({
  fields,
  data,
}: {
  fields: [string, string][];
  data: PreviewData;
}) {
  return (
    <table className="document-fields">
      <tbody>
        {Array.from({ length: Math.ceil(fields.length / 2) }, (_, row) => (
          <tr key={row}>
            {fields.slice(row * 2, row * 2 + 2).map(([label, key]) => (
              <td key={key}>
                <span>{label}</span>
                <strong>{getValue(data, key)}</strong>
              </td>
            ))}
            {fields.slice(row * 2, row * 2 + 2).length === 1 && <td />}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function A4Page({
  children,
  pageNumber,
}: {
  children: ReactNode;
  pageNumber: number;
}) {
  return (
    <article className="a4-page">
      {children}
      <footer className="document-page-number">Page {pageNumber}</footer>
    </article>
  );
}

export function FormPreview({
  data,
  onDownload,
}: {
  data: PreviewData;
  onDownload: () => void;
}) {
  return (
    <aside className="preview-column w-full shrink-0 xl:sticky xl:top-6 xl:mt-0 xl:w-[min(30vw,400px)]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 uppercase">
            Live document preview
          </h2>
        </div>
        <button
          type="button"
          onClick={onDownload}
          className="inline-flex min-h-10 shrink-0 items-center uppercase cursor-pointer justify-center rounded-md bg-accent px-3.5 py-2 text-sm font-semibold text-white hover:bg-[#2b8068] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Download PDF
        </button>
      </div>
      <div className="preview-scroll max-h-[82vh] overflow-y-auto rounded-lg border border-slate-200 bg-slate-200 p-3">
        <div className="pdf-preview">
          <A4Page pageNumber={1}>
            <header className="document-header">
              <div className="document-brand">
                <Image
                  src="/hec-logo.png"
                  alt="HEC logo"
                  width={46}
                  height={46}
                />
                <div>
                  <strong>Higher Education Commission</strong>
                  <span>Government of Pakistan</span>
                </div>
              </div>
              <h1 className="document-title">Program Registration Proforma</h1>
            </header>

            <h2 className="document-section-title">
              1. Institution &amp; program information
            </h2>
            <FieldTable fields={institutionFields} data={data} />

            <h2 className="document-section-title">
              2. Study structure &amp; recognition
            </h2>
            <FieldTable fields={studyFields} data={data} />
            <p className="document-note">
              NOC applies to MS/MPhil/equivalent and PhD programs started after
              07.11.2013.
            </p>
            {/* <section
              className="paper-authorization"
              aria-label="Authorization fields"
            >
              <h2>Authorized by</h2>
              {[
                "Signature",
                "Name",
                "Designation",
                "Date",
                "Official Stamp",
                "Contact No",
              ].map((label) => (
                <div className="paper-signature-line" key={label}>
                  <span>{label}</span>
                  <span aria-hidden="true" />
                </div>
              ))}
            </section> */}
          </A4Page>

          <A4Page pageNumber={2}>
            <header className="document-header document-header-compact">
              <h1>Documents Provided Checklist</h1>
              <p>PQR Proforma</p>
            </header>
            <table className="document-checklist">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Description</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((document, index) => (
                  <tr key={document}>
                    <td>{index + 1}</td>
                    <td>{document}</td>
                    <td>{getValue(data, `document-${index}`)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <section
              className="paper-authorization"
              aria-label="Authorization fields"
            >
              <h2>Authorized by</h2>
              {[
                "Signature",
                "Name",
                "Designation",
                "Date",
                "Official Stamp",
                "Contact No",
              ].map((label) => (
                <div className="paper-signature-line" key={label}>
                  <span>{label}</span>
                  <span aria-hidden="true" />
                </div>
              ))}
            </section>
          </A4Page>
        </div>
      </div>
    </aside>
  );
}
