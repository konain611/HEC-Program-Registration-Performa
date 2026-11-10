"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { FormPreview, type PreviewData } from "@/components/registration/form-preview";
import { FormProgress } from "@/components/registration/form-progress";
import { RegistrationForm } from "@/components/registration/registration-form";

export default function Home() {
  const [previewData, setPreviewData] = useState<PreviewData>({});
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <main className="min-h-screen bg-[#f5f7f6] pb-12 text-slate-800">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <Image src="/hec-logo.png" alt="HEC logo" width={44} height={44} priority />
            <span>
              <span className="block text-sm font-semibold text-slate-900">Higher Education Commission</span>
              <span className="mt-0.5 block text-xs text-slate-500">Government of Pakistan</span>
            </span>
          </div>
          <span className="hidden text-sm font-medium text-slate-500 sm:block">Program Quality Registry</span>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1900px] flex-col items-stretch gap-6 px-4 pt-8 sm:px-6 sm:pt-12 xl:flex-row xl:items-start">
        <FormProgress />
        <RegistrationForm
          formRef={formRef}
          onPreviewChange={setPreviewData}
          onValidSubmit={() => window.print()}
        />
        <FormPreview
          data={previewData}
          onDownload={() => formRef.current?.requestSubmit()}
        />
      </div>
    </main>
  );
}
