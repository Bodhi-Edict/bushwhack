import { type Decimal } from "@prisma/client/runtime/library";
import { type QuestionTruncated } from "./questionTypes";

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

export type TestPage = {
  id: string,
  name: string,
  instructions: string,
  imageUrl: string,
  maxTimeInMins: number | null,
  maxLength: number | null,
  questions: QuestionTruncated[]
};

export type CheckAnswer = {
  error: false,
  id: string,
  working: string,
  isCorrect: boolean,
  questionId: string,
};

export type CheckAnswerError = {
  error: true,
  message: string,
  questionId: string
};

export type SubmitTest = {
  id: string,
  progress: Decimal, 
  endTime: Date
};