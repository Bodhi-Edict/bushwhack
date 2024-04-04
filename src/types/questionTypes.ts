export enum QuestionStatus {
  ERROR,
  UNATTEMPTED,
  LOADING,
  NEED_TO_CHECK,
  CORRECT,
  INCORRECT,
}

export type QuestionTruncated = {
  correctValues: string[],
  title: string,
  id: string,
}

export type ComputedAnswer = {
  explanation: string;
  isCorrect: boolean;
}; 
