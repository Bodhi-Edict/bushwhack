import { TRPCClientError } from "@trpc/client";
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
 
function getMessage(working: string, correctAnswers: string[], answer?: number): OpenAIResponse {
  const isCorrect = answer && correctAnswers.includes(answer.toFixed(4)) ? true : false;
  return { 
    working: working, 
    is_correct: isCorrect,
    answer: answer?.toFixed(4) ?? '',
  };
}

async function runCalculate(working: string, assistantId: string): Promise<number | undefined> {
  const calculatorPreMessage = "Run get_answer after calculating these instructions given to you in English: \n"
  const calculatorPostMessage = ''
  const calculatorMessage = `${calculatorPreMessage}${working}${calculatorPostMessage}`
  
  const thread = await openai.beta.threads.create();
  await openai.beta.threads.messages.create(
    thread.id,
    {
      role: 'user',
      content: calculatorMessage
    }
  );

  let run = await openai.beta.threads.runs.create(
    thread.id,
    { 
      assistant_id: assistantId,
    }
  );

  while (['queued', 'in_progress', 'cancelling'].includes(run.status)) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 seconds
    run = await openai.beta.threads.runs.retrieve(
      run.thread_id,
      run.id
    );
  }

  if (run.status === 'requires_action') {
    const functionName = run.required_action?.submit_tool_outputs.tool_calls[0]?.function.name
    if(functionName == 'get_answer') {
      const response = run.required_action?.submit_tool_outputs.tool_calls[0]?.function.arguments ?? ''
      try {
        const responseJson = JSON.parse(response) as {
          answer: number,
        }
        return responseJson.answer;
      } catch {
        return;
      }
    }
  }
}

export async function compute(prompt: string, assistantId: string, calculatorAssistantId: string, correctAnswers: string[]): Promise<OpenAIResponse> {
  const userMessagePreExplanation = "Run the compute_response function on the following explanation given by your friend: \n"
  const userMessagePostExplanation = ''
  const messageContent = `${userMessagePreExplanation}${prompt}${userMessagePostExplanation}`;

  const thread = await openai.beta.threads.create();
  await openai.beta.threads.messages.create(
    thread.id,
    {
      role: 'user',
      content: messageContent
    }
  );

  let run = await openai.beta.threads.runs.create(
    thread.id,
    { 
      assistant_id: assistantId,
    }
  );

  while (['queued', 'in_progress', 'cancelling'].includes(run.status)) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 seconds
    run = await openai.beta.threads.runs.retrieve(
      run.thread_id,
      run.id
    );
  }

  // Handles the cases where there is no computation and there is a fundamental error
  if(run.status == 'completed') {
    const messages = await openai.beta.threads.messages.list(run.thread_id)
    const response = messages.data[0]
    let responseText;
    if(response?.content[0]?.type === 'text') {
      responseText = response.content[0].text.value;
      return getMessage(
        responseText, 
        correctAnswers, 
      )
    } else {
      throw new Error("Something went wrong. The AI could not compute your answer. Please try again");
    }
  } 

  // Handles the more complex case where computation is involved
  if(run.status == 'requires_action') {
    const functionName = run.required_action?.submit_tool_outputs.tool_calls[0]?.function.name
    if(functionName == 'compute_response') {
      const response = run.required_action?.submit_tool_outputs.tool_calls[0]?.function.arguments ?? ''
      if(response.length === 0) {
        throw new Error('Something went wrong. The AI returned a response with an incorrect format. Please try again.')
      }
      try {
        const responseJson = JSON.parse(response) as {
          response: string
          answer: string
        };
        const answer = await runCalculate(
          responseJson.response, 
          calculatorAssistantId
        )
        return getMessage(responseJson.response, correctAnswers, answer)
      } catch {
        throw new Error('Something went wrong. The AI returned a response with an incorrect format. Please try again.')
      }
    }
  }

  throw new Error('Something went wrong. The AI returned a response which we could not process. Please try again.')
}
