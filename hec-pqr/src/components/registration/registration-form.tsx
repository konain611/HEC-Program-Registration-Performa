"use client";

import { useState, type FormEvent, type RefObject } from "react";
import { DocumentsSection, InstitutionProgramSection, StudyStructureSection } from "./sections";
import type { PreviewData } from "./form-preview";

function updateDateValidity(form: HTMLFormElement) {
  const startDate = form.elements.namedItem("degreeStartDate") as HTMLInputElement;
  const endDate = form.elements.namedItem("degreeEndDate") as HTMLInputElement;

  endDate.setCustomValidity(
    startDate.value && endDate.value && endDate.value < startDate.value
      ? "The degree end date must be on or after the start date."
      : "",
  );
}

export function RegistrationForm({
  formRef,
  onPreviewChange,
  onValidSubmit,
}: {
  formRef: RefObject<HTMLFormElement | null>;
  onPreviewChange: (data: PreviewData) => void;
  onValidSubmit: () => void;
}) {
  const [validationMessage, setValidationMessage] = useState("");
  const [hasAttemptedValidation, setHasAttemptedValidation] = useState(false);

  function handleFieldChange(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    updateDateValidity(form);
    const values: PreviewData = {};
    new FormData(form).forEach((value, key) => {
      if (typeof value === "string") values[key] = value;
    });
    onPreviewChange(values);

    if (hasAttemptedValidation) {
      setValidationMessage(
        form.checkValidity()
          ? "All required fields are valid."
          : "Please complete the required fields and correct any highlighted entries.",
      );
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setHasAttemptedValidation(true);
    updateDateValidity(form);

    if (!form.checkValidity()) {
      form.reportValidity();
      setValidationMessage("Please complete the required fields and correct any highlighted entries.");
      form.querySelector<HTMLElement>(":invalid")?.focus();
      return;
    }

    setValidationMessage("All required fields are valid.");
    onValidSubmit();
  }

  function handleReset() {
    setHasAttemptedValidation(false);
    setValidationMessage("");
    onPreviewChange({});
  }

  return (
    <div className="registration-column min-w-0 w-full max-w-4xl flex-1">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-accent">Program Quality Registry</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          Program Registration Proforma
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          Provide the program details and required supporting documents for registration.
        </p>
      </div>

      <div className="mb-5 flex gap-3 rounded-lg border border-[#cce4d9] bg-[#edf6f1] p-4 text-sm leading-6 text-[#285c4d]">
        <span className="mt-0.5 shrink-0 font-semibold" aria-hidden="true">i</span>
        <p>
          Please fill in every field carefully. All fields are mandatory. Select
          “Not applicable” where it is offered and does not apply to your program.
        </p>
      </div>

      <form
        ref={formRef}
        className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
        onSubmit={handleSubmit}
        onChange={handleFieldChange}
        onReset={handleReset}
        data-validation-attempted={hasAttemptedValidation}
        noValidate
      >
        <InstitutionProgramSection />
        <StudyStructureSection />
        <DocumentsSection />

        <div className="flex flex-col gap-4 bg-slate-50 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div aria-live="polite" role="status" className="max-w-xl text-sm leading-6">
            {validationMessage ? (
              <p className={validationMessage.startsWith("All required") ? "font-medium text-accent" : "text-red-700"}>
                {validationMessage}
              </p>
            ) : (
              <p className="text-slate-500">
                Fields marked <span className="font-semibold text-red-600">*</span> are required.
              </p>
            )}
          </div>
          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <button
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              type="reset"
            >
              Clear form
            </button>
            <button
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2b8068] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              type="submit"
            >
              Download PDF
            </button>
          </div>
        </div>
      </form>

    </div>
  );
}
