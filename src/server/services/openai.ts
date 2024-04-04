import { OpenAI } from "openai";

type OpenAIResponse = {
  answer: string;
  working: string;
  is_correct: boolean;
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const computeAnswer = async (
  assistantId: string,
  questionPrompt: string,
  userExplanation: string
): Promise<OpenAIResponse> => {

  const thread = await openai.beta.threads.create();
  await openai.beta.threads.messages.create(
    thread.id,
    {
      role: 'user',
      content: questionPrompt + userExplanation
    }
  );

  let run = await openai.beta.threads.runs.create(
    thread.id,
    { 
      assistant_id: assistantId,
    }
  );

  while (['queued', 'in_progress', 'cancelling'].includes(run.status)) {
    await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for 3 seconds
    run = await openai.beta.threads.runs.retrieve(
      run.thread_id,
      run.id
    );
  }

  if (run.status === 'completed') {
    const messages = await openai.beta.threads.messages.list(
      run.thread_id
    );
    
    let response = "";
    const message = messages.data[0]
    if(message?.content[0]?.type === 'text') {
      response = message.content[0].text.value;
    } else {
      throw new Error("No text response found");
    }
    try {
      const json = JSON.parse(response) as OpenAIResponse;
      return json;

    } catch {
      throw new Error("Invalid JSON response");
    }
  } else {
    throw new Error("Run failed");
  }
};
 
