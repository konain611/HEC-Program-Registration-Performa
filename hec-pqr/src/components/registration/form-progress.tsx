"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "institution-program", label: "Institution & program information" },
  { id: "study-structure", label: "Study structure & recognition" },
  { id: "documents-checklist", label: "Documents provided checklist" },
];

export function FormProgress() {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [positions, setPositions] = useState([0, 0, 0]);

  useEffect(() => {
    let frame = 0;

    function updateProgress() {
      const progressLine = window.innerHeight * 0.5;
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      setProgress(maxScroll === 0 ? 1 : Math.min(1, Math.max(0, window.scrollY / maxScroll)));

      let active = 0;
      const nextPositions = sections.map((section, index) => {
        const element = document.getElementById(section.id);
        const sectionTop = element ? element.getBoundingClientRect().top + window.scrollY : 0;
        if (element && sectionTop <= window.scrollY + progressLine) active = index;
        return maxScroll === 0
          ? index / (sections.length - 1)
          : Math.min(1, Math.max(0, (sectionTop - progressLine) / maxScroll));
      });

      setPositions(nextPositions);
      setActiveSection(active);
    }

    function scheduleUpdate() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateProgress);
    }

    updateProgress();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  return (
    <nav aria-label="Form sections" className="sticky top-[15vh] hidden w-56 shrink-0 self-start xl:block">
      <div
        className="relative h-[70vh]"
        role="progressbar"
        aria-label="Form completion progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        aria-valuetext={`${Math.round(progress * 100)} percent; ${sections[activeSection].label}`}
      >
        <div className="absolute right-0 top-0 flex w-full items-center justify-end gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Form progress</span>
          <span className="text-sm font-bold tabular-nums text-[#267a62]">{Math.round(progress * 100)}%</span>
        </div>
        <span className="absolute bottom-2 right-3.25 top-10 w-0.5 bg-slate-200" aria-hidden="true" />
        <span
          className="absolute bottom-2 right-3.25 top-10 origin-top bg-[#267a62] transition-transform duration-300 ease-out"
          style={{ transform: `scaleY(${progress})` }}
          aria-hidden="true"
        />
        {sections.map((section, index) => {
          const sectionProgress = positions[index];
          const top = `calc(40px + ${sectionProgress * 70}vh - ${sectionProgress * 48}px)`;

          return (
            <button
              key={section.id}
              type="button"
              aria-label={`Go to section ${index + 1}: ${section.label}`}
              aria-current={activeSection === index ? "step" : undefined}
              onClick={() => document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" })}
              style={{ top }}
              className="group absolute left-0 z-10 flex w-full -translate-y-1/2 cursor-default items-center justify-end gap-4 rounded-md py-2 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              title={section.label}
            >
              <span className={`text-right text-sm leading-5 transition-colors duration-300 ${index === activeSection ? "font-semibold text-[#267a62]" : index < activeSection ? "text-slate-700" : "text-slate-500 group-hover:text-slate-800"}`}>
                {section.label}
              </span>
              <span
                className={`flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 bg-[#f5f7f6] transition-all duration-300 ${
                  index < activeSection
                    ? "border-[#267a62] bg-[#267a62]"
                    : index === activeSection
                      ? "scale-110 border-accent bg-accent shadow-md shadow-accent/25"
                      : "border-slate-300"
                }`}
                aria-hidden="true"
              >
                <span className={`text-[10px] font-bold leading-none ${index <= activeSection ? "text-white" : "text-slate-500"}`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
