import { NextResponse } from "next/server";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

type RegistrationFormData = Omit<
  Prisma.ProgramRegistrationCreateInput,
  | "creditHours"
  | "semesterCount"
  | "degreeStartDate"
  | "degreeEndDate"
  | "recognitionDate"
  | "isCurrent"
  | "documentStatuses"
> & {
  creditHours: string;
  semesterCount: string;
  degreeStartDate: string;
  degreeEndDate: string;
  recognitionDate: string;
  isCurrent: string;
  documentStatuses: Prisma.InputJsonObject;
};

export async function POST(request: Request) {
  try {
    const form = (await request.json()) as RegistrationFormData;
    const registration = await prisma.programRegistration.create({
      data: {
        ...form,
        creditHours: Number(form.creditHours),
        semesterCount: Number(form.semesterCount),
        degreeStartDate: new Date(form.degreeStartDate),
        degreeEndDate: new Date(form.degreeEndDate),
        recognitionDate: new Date(form.recognitionDate),
        isCurrent: form.isCurrent === "Yes",
      },
    });

    return NextResponse.json({ id: registration.id }, { status: 201 });
  } catch (error) {
    console.error("Failed to save program registration.", error);
    return NextResponse.json(
      { error: "The registration could not be saved. Please try again." },
      { status: 500 },
    );
  }
}
