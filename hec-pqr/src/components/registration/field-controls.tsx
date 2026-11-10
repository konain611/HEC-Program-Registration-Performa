import type { ReactNode } from "react";

export const inputClass =
  "mt-2 block w-full rounded-md border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:bg-slate-100";

const selectClass = `${inputClass} cursor-pointer`;

export function Field({
  label,
  name,
  children,
  hint,
}: {
  label: string;
  name?: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium leading-6 text-slate-800" htmlFor={name}>
        {label}
        <span className="ml-1 text-red-600" aria-hidden="true">*</span>
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs leading-5 text-slate-500">{hint}</p>}
    </div>
  );
}

export function Section({
  id,
  number,
  title,
  description,
  children,
}: {
  id: string;
  number: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8 border-b border-slate-200 px-5 py-7 sm:px-8 sm:py-9">
      <div className="mb-6 flex items-start gap-3.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
          {number}
        </span>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          {description && <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

export function TextInput({
  name,
  placeholder,
  type = "text",
  min,
  pattern,
}: {
  name: string;
  placeholder?: string;
  type?: string;
  min?: string;
  pattern?: string;
}) {
  return (
    <input
      className={inputClass}
      id={name}
      name={name}
      type={type}
      placeholder={placeholder}
      min={min}
      pattern={pattern}
      required
    />
  );
}

export function SelectInput({
  name,
  options,
  placeholder = "Select an option",
}: {
  name: string;
  options: string[];
  placeholder?: string;
}) {
  return (
    <select className={selectClass} id={name} name={name} defaultValue="" required>
      <option value="" disabled>{placeholder}</option>
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  );
}

export function RadioChoices({ name, options }: { name: string; options: string[] }) {
  return (
    <div className="radio-group mt-3 flex flex-wrap gap-x-6 gap-y-3">
      {options.map((option) => (
        <label key={option} className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-700">
          <input
            className="h-4 w-4 accent-accent focus:ring-accent"
            type="radio"
            name={name}
            value={option}
            required
          />
          {option}
        </label>
      ))}
    </div>
  );
}
