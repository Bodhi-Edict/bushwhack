export type OpenAIResponse = {
  error: false;
  answer: string;
  working: string;
  is_correct: boolean;
};

export type OpenAIResponseError = {
  error: true;
  message: string;
};