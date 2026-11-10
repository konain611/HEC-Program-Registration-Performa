import {
  Field,
  inputClass,
  RadioChoices,
  Section,
  SelectInput,
  TextInput,
} from "./field-controls";

const qualifications = [
  "Level 5 — Bachelor (14 Years) Degree",
  "Level 6 — Bachelor (15 Years) Degree",
  "Level 6 — Bachelor (16 Years) Degree",
  "Level 6 — Master (16 Years) Degree",
  "Level 6 — PGD",
  "Level 7 — M-Phil (18 Years) Degree",
  "Level 7 — Master (17 Years) Degree",
  "Level 7 — Master / MS (18 Years) Degree",
  "Level 8 — Doctorate Degree",
  "Level 8 — MS leading to PhD",
];

export const documents = [
  "Program Registration Form duly signed by the HOD",
  "Approval of the Degree Program by the University’s statutory body (e.g., Academic Council, Syndicate).",
  "Advertisement of the first batch of the program",
  "NOC from HEC for Level 7 & 8 programs initiated after November 2013",
  "Accreditation Letter for professional degree programs (where applicable). If discontinued: End date of the program (as per University or HEC notification).",
  "For migrated programs: Initial approval of the Degree Program by the University’s statutory body, along with revised approval for transfer to the new department",
];

export function InstitutionProgramSection() {
  return (
    <Section id="institution-program" number="01" title="Institution & program information">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name of HEI" name="heiName">
          <TextInput name="heiName" placeholder="Enter the name of the institution" />
        </Field>
        <Field label="Campus name" name="campusName">
          <TextInput name="campusName" placeholder="Enter the campus name" />
        </Field>
        <Field label="Department name" name="departmentName">
          <TextInput name="departmentName" placeholder="Enter the department name" />
        </Field>
        <Field label="Qualification level" name="qualificationLevel">
          <SelectInput name="qualificationLevel" options={qualifications} />
        </Field>
        <Field label="Program equivalent" name="programEquivalent">
          <TextInput name="programEquivalent" placeholder="Enter program equivalent" />
        </Field>
        <Field label="Degree abbreviation" name="degreeAbbreviation">
          <TextInput name="degreeAbbreviation" placeholder="e.g. BS, MS, PhD" />
        </Field>
        <Field label="Eligibility criteria" name="eligibilityCriteria">
          <textarea
            className={`${inputClass} min-h-24 resize-y`}
            id="eligibilityCriteria"
            name="eligibilityCriteria"
            placeholder="Describe the admission and eligibility requirements"
            required
          />
        </Field>
        <Field label="Accreditation status" name="accreditationStatus">
          <SelectInput
            name="accreditationStatus"
            options={["Accredited", "Applied for accreditation", "Not accredited", "Not applicable"]}
          />
        </Field>
        <Field label="Field of study" name="fieldOfStudy">
          <TextInput name="fieldOfStudy" placeholder="Enter field of study" />
        </Field>
        <Field label="Subject" name="subject">
          <TextInput name="subject" placeholder="Enter the subject or discipline" />
        </Field>
      </div>
    </Section>
  );
}

export function StudyStructureSection() {
  return (
    <Section id="study-structure" number="02" title="Study structure & recognition">
      <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
        <Field label="Education system" name="educationSystem">
          <SelectInput name="educationSystem" options={["Annual", "Semester", "Term"]} />
        </Field>
        <Field label="Mode of study" name="modeOfStudy">
          <SelectInput name="modeOfStudy" options={["Distance Learning", "Private", "Regular"]} />
        </Field>
        <Field label="Session type" name="sessionType">
          <SelectInput name="sessionType" options={["Afternoon", "Morning", "Evening", "Weekend"]} />
        </Field>
        <Field label="Area of specialization" name="areaOfSpecialization">
          <TextInput name="areaOfSpecialization" placeholder="Enter the area of specialization" />
        </Field>
        <Field label="Other area of specialization" name="otherSpecialization">
          <TextInput name="otherSpecialization" placeholder="Enter another specialization, if applicable" />
        </Field>
        <Field label="Credit hours" name="creditHours">
          <TextInput name="creditHours" type="number" min="0" placeholder="e.g. 136" />
        </Field>
        <Field label="Program duration" name="programDuration" hint="Include the unit, for example 4 years.">
          <TextInput name="programDuration" placeholder="e.g. 4 years" />
        </Field>
        <Field label="Number of semesters / terms" name="semesterCount">
          <TextInput name="semesterCount" type="number" min="1" placeholder="e.g. 8" />
        </Field>
        <Field label="Degree minimum duration" name="minimumDuration">
          <TextInput name="minimumDuration" placeholder="e.g. 4 years" />
        </Field>
        <Field label="Degree maximum duration" name="maximumDuration">
          <TextInput name="maximumDuration" placeholder="e.g. 6 years" />
        </Field>
        <Field label="Degree start date" name="degreeStartDate">
          <TextInput name="degreeStartDate" type="date" />
        </Field>
        <Field label="Degree end date" name="degreeEndDate">
          <TextInput name="degreeEndDate" type="date" />
        </Field>
        <Field label="Is this program current?" name="isCurrent">
          <SelectInput name="isCurrent" options={["Yes", "No"]} />
        </Field>
        <Field label="Program recognition date" name="recognitionDate">
          <TextInput name="recognitionDate" type="date" />
        </Field>
      </div>
      <div className="mt-7 border-t border-slate-200 pt-6">
        <Field
          label="NOC obtained from HEC"
          hint="Only for MS/MPhil/equivalent and PhD programs started after 07.11.2013."
        >
          <RadioChoices name="nocObtained" options={["No", "Yes", "Not applicable"]} />
        </Field>
      </div>
    </Section>
  );
}

export function DocumentsSection() {
  return (
    <Section
      id="documents-checklist"
      number="03"
      title="Documents provided checklist"
      description="Select a status for every document."
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-y border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
              <th scope="col" className="w-12 px-3 py-3">S.No</th>
              <th scope="col" className="px-3 py-3">Description</th>
              <th scope="col" className="w-52 px-3 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {documents.map((document, index) => (
              <tr key={document} className="align-top">
                <td className="px-3 py-4 text-slate-500">{index + 1}</td>
                <td className="px-3 py-4 leading-6 text-slate-800">{document}</td>
                <td className="px-3 py-4">
                  <label className="sr-only" htmlFor={`document-${index}`}>
                    Status for document {index + 1}: {document}
                  </label>
                  <select
                    className={`${inputClass} mt-0 cursor-pointer py-2.5`}
                    id={`document-${index}`}
                    name={`document-${index}`}
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>Select status</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Not applicable">Not applicable</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
