import { type Decimal } from "@prisma/client/runtime/library";

export type SubjectsPage = {
  name: string,
  description: string,
  iconUrl: string,
  slug: string
  id: string
}[];

export type SubjectPage = {
  name: string,
  description: string,
  iconUrl: string,
  tests: {
      id: string,
      name: string,
      maxTimeInMins: number | null,
      attempts: number,
      imageUrl: string,
      progress: Decimal
  }[]
};