import { type QuestionStatus } from "~/types/questionTypes";

type QuestionState = {
  id: string
  status: QuestionStatus
  working: string;
};

export enum ActionType {
  UpdateQuestion = 'UPDATE_QUESTION',
}

type Action =
  | { type: ActionType.UpdateQuestion; payload: { questionId: string, newStatus: QuestionStatus, working: string } }

export const testAttemptReducer = (state: QuestionState[], action: Action) => {
  switch (action.type) {
    case ActionType.UpdateQuestion:
      return state.map((question) => {
        if (question.id === action.payload.questionId) {
          return {
            ...question,
            status: action.payload.newStatus,
            working: action.payload.working,
          };
        }
        return question;
      });

    default:
      return state;
  }
}
