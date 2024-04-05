import { type Explanation } from "@prisma/client";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure
} from "~/server/api/trpc";
import { computeAnswer } from "~/server/services/openai";
import { type CheckAnswerError, type CheckAnswer } from "~/types/apiResponse.types";

export const answerRouter = createTRPCRouter({

  checkQuestion: protectedProcedure
    .input(z.object({
      testAttemptId: z.string({
        required_error: "TestAttemptId is required"
      }),
      questionId: z.string({
        required_error: "QuestionId is required"
      }),
      explanationText: z.string({
        required_error: "Explanation is required"
      }),
    }))
    .mutation(async ({ ctx, input }):Promise<CheckAnswer | CheckAnswerError> => {
      const testAttemptId = input.testAttemptId;
      const questionId = input.questionId;
      const explanationText = input.explanationText;
      if(ctx.session?.user === undefined) {
        return {
          error: true,
          message: "User not found. Please refresh the page and login again."
        }
      }
      const testAttempt = await ctx.db.testAttempt.findUnique({
        where: {
          id: testAttemptId
        },
        include: {
          test: true
        }
      });
      if(!testAttempt) {
        return {
          error: true,
          message: "Test attempt not found"
        }
      }
      const question = await ctx.db.question.findUnique({
        where: {
          id: questionId
        }
      });
      console.log("Question: ", question)
      console.log("ID: ", question?.assistantId)
      if(!question?.assistantId || question?.assistantId === null) {
        return {
          error: true,
          message: "Question not found"
        }
      }
      const explanationList = await ctx.db.explanation.findMany({
        where: {
          testAttemptId: testAttemptId,
          text: explanationText,
        }
      });
      let explanation: Explanation;
      if(explanationList.length > 0 && explanationList[0] !== null && explanationList[0] !== undefined) {
        explanation = explanationList[0];
        const answer = await ctx.db.answer.findFirst({
          where: {
            questionId: questionId,
            explanationId: explanation.id
          }
        });
        if(answer !== null) {
          return {
            error: false,
            id: answer.id,
            working: answer.computedWorking,
            isCorrect: answer.isCorrect
          }
        }
      } else {
        explanation = await ctx.db.explanation.create({
          data: {
            testAttemptId: testAttemptId,
            text: explanationText,
            testId: testAttempt.testId,
            userId: ctx.session?.user.id,
          }
        });
      }
      let aiResponse;
      try {
        aiResponse = await computeAnswer(
          question.assistantId,
          "",
          explanationText
        )
      } catch (e) {
        let errorMessage = "";
        if (typeof e === "string") {
          errorMessage = e
        } else if (e instanceof Error) {
          errorMessage = e.message
        }
        return {
          error: true,
          message: "Failed to compute answer. " + errorMessage
        }
      }

      const answer = await ctx.db.answer.create({
        data: {
          questionId: questionId,
          explanationId: explanation.id,
          computedAnswer: String(aiResponse.answer),
          computedWorking: aiResponse.working,
          isCorrect: aiResponse.is_correct
        }
      });

      return {
        error: false,
        id: answer.id,
        working: aiResponse.working,
        isCorrect: aiResponse.is_correct,
      }

    }),


  // submitTest: protectedProcedure
  //   .input(z.object({
  //     testAttemptId: z.string({
  //       required_error: "TestAttemptId is required"
  //     }),
  //     explanationText: z.string({
  //       required_error: "Explanation is required"
  //     }),
  //   }))
  //   .mutation(async ({ ctx, input }):Promise<SubmitTest | CheckAnswerError> => {
  //     const testAttemptId = input.testAttemptId;
  //     const explanationText = input.explanationText;

  //     // Check if user is logged in
  //     if(ctx.session?.user === undefined) {
  //       return {
  //         error: true,
  //         message: "User not found. Please refresh the page and login again."
  //       }
  //     }
  //     const testAttempt = await ctx.db.testAttempt.findUnique({
  //       where: {
  //         id: testAttemptId
  //       },
  //       include: {
  //         test: {
  //           include: {
  //             questions: true
  //           }
  //         }
  //       }
  //     });

  //     // If no test attempt is not found return an error
  //     if(!testAttempt) {
  //       return {
  //         error: true,
  //         message: "Test attempt not found"
  //       }
  //     }

  //     const explanationList = await ctx.db.explanation.findMany({
  //       where: {
  //         testAttemptId: testAttemptId,
  //         text: explanationText,
  //       }
  //     });
      
  //     let explanation: Explanation;
  //     if(explanationList.length > 0 && explanationList[0] !== null && explanationList[0] !== undefined) {
  //       explanation = explanationList[0];
  //     } else {
  //       explanation = await ctx.db.explanation.create({
  //         data: {
  //           testAttemptId: testAttemptId,
  //           text: explanationText,
  //           testId: testAttempt.testId,
  //           userId: ctx.session?.user.id,
  //         }
  //       });
  //     }

  //     let isCorrect = 0;
  //     const computedAnswers:(CheckAnswer | CheckAnswerError)[] = []

  //     for (const question of testAttempt.test.questions) {

  //       // If question or assistant Id of questiont not found add error to computed answer.
  //       if (!question?.assistantId || question?.assistantId === null) {
  //         computedAnswers.push({
  //           error: true,
  //           message: "Question not found"
  //         });
  //         continue;
  //       }

  //       // If an existing answer is found add it to the computed answers without querying AI
  //       const existingAnswer = await ctx.db.answer.findFirst({
  //         where: {
  //           questionId: question.id,
  //           explanationId: explanation.id
  //         }
  //       });
  //       if (existingAnswer !== null) {
  //         computedAnswers.push({
  //           error: false,
  //           id: existingAnswer.id,
  //           working: existingAnswer.computedWorking,
  //           isCorrect: existingAnswer.isCorrect
  //         });
  //         continue;
  //       }

  //       let aiResponse;
  //       try {
  //         aiResponse = await computeAnswer(
  //           question.assistantId,
  //           "",
  //           explanationText
  //         );
  //       } catch (e) {
  //         // If an error occurs while computing the answer, add error to computed answer.
  //         let errorMessage = "";
  //         if (typeof e === "string") {
  //           errorMessage = e;
  //         } else if (e instanceof Error) {
  //           errorMessage = e.message;
  //         }
  //         computedAnswers.push({
  //           error: true,
  //           message: "Failed to compute answer. " + errorMessage
  //         });
  //         continue;
  //       }

  //       const answer = await ctx.db.answer.create({
  //         data: {
  //           questionId: question.id,
  //           explanationId: explanation.id,
  //           computedAnswer: String(aiResponse.answer),
  //           computedWorking: aiResponse.working,
  //           isCorrect: aiResponse.is_correct
  //         }
  //       });

  //       isCorrect += aiResponse.is_correct ? 1 : 0;

  //       computedAnswers.push({
  //         error: false,
  //         id: answer.id,
  //         working: aiResponse.working,
  //         isCorrect: aiResponse.is_correct,
  //       });
  //     }
      
  //     return {
  //       error: false,
  //       answers: computedAnswers,
  //       progress: isCorrect / testAttempt.test.questions.length
  //     }
    
  //   })

});
