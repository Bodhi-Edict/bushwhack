import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure
} from "~/server/api/trpc";
import { compute } from "~/server/services/openai";
import { type CheckAnswer, type SubmitTest } from "~/types/apiResponse.types";

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
    .mutation(async ({ ctx, input }):Promise<CheckAnswer> => {
      const testAttemptId = input.testAttemptId;
      const questionId = input.questionId;
      const explanationText = input.explanationText;

      // If no user is found return an error
      if(ctx.session?.user === undefined) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not found. Please refresh the page and login again.",
        })
      }

      const testAttempt = await ctx.db.testAttempt.findUnique({
        where: {
          id: testAttemptId
        },
        include: {
          test: true
        }
      });

      // If no test attempt is found return an error
      if(!testAttempt) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Test attempt not found. Please refresh the page and try again.",
        })
      }

      const question = await ctx.db.question.findUnique({
        where: {
          id: questionId
        }
      });

      // If no question is found return an error
      if(!question?.assistantId || !question?.calculateAssistantId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Question not found. Please try again.",
        })
      }

      // Check if the explanation already exists
      // To be efficient in the OpenAI API calls this does not chekc by user but simply matches the text
      let explanation = await ctx.db.explanation.findFirst({
        where: {
          text: explanationText,
        }
      });
      if(explanation !== null && explanation !== undefined) {
        // If an existing explanation exists it's highly likely that an OPenAI call has already been made
        // We get the associated answer even if it's not from the same user
        const answer = await ctx.db.answer.findFirst({
          where: {
            questionId: questionId,
            explanationId: explanation.id
          }
        });
        if(answer !== null) {
          // If there is an existing answer we now check if the users are the same
          // If the users are not the same we create an answer and explanation for the user for our records
          if(explanation.userId !== ctx.session?.user.id) {
            explanation = await ctx.db.explanation.create({
              data: {
                testAttemptId: testAttemptId,
                text: explanationText,
                testId: testAttempt.testId,
                userId: ctx.session?.user.id,
              }
            });
            const newAnswer = await ctx.db.answer.create({
              data: {
                questionId: questionId,
                explanationId: explanation.id,
                computedAnswer: answer.computedAnswer,
                computedWorking: answer.computedWorking,
                isCorrect: answer.isCorrect
              }
            });
            return {
              error: false,
              id: newAnswer.id,
              working: newAnswer.computedWorking,
              isCorrect: newAnswer.isCorrect,
              questionId: questionId,
            }
          }
          return {
            error: false,
            id: answer.id,
            working: answer.computedWorking,
            isCorrect: answer.isCorrect,
            questionId: questionId,
          }
        }
      // Here we handle the case where no explanation was found and we create a new one 
      // And compute the answer from the OpenAI API
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
      const aiResponse = await compute(
        explanationText,
        question.assistantId,
        question.calculateAssistantId,
        question.correctValues
      )
      const answer = await ctx.db.answer.create({
        data: {
          questionId: questionId,
          explanationId: explanation.id,
          computedAnswer: String(aiResponse.answer),
          computedWorking: aiResponse.working,
          isCorrect: aiResponse.is_correct ?? false
        }
      });

      return {
        error: false,
        id: answer.id,
        working: aiResponse.working,
        isCorrect: aiResponse.is_correct,
        questionId: questionId,
      }

    }),

  // The submit test endpoint is used to submit the test attempt
  // It double checks if the number of correct answers is the same as the one available in the backend
  // If the number of correct answers is the same, it returns the progress of the test and updates it in the test attempt
  submitTest: protectedProcedure
    .input(z.object({
      testAttemptId: z.string({
        required_error: "TestAttemptId is required"
      }),
      explanationText: z.string({
        required_error: "Explanation is required"
      }),
      numberCorrect: z.number({
        required_error: "Number Correct is required"
      }),
    }))
    .mutation(async ({ ctx, input }):Promise<SubmitTest> => {
      const testAttemptId = input.testAttemptId;
      const explanationText = input.explanationText;

      // Check if user is logged in
      if(ctx.session?.user === undefined) {
        throw new Error("User not found. Please login again.");
      }
      const testAttempt = await ctx.db.testAttempt.findUnique({
        where: {
          id: testAttemptId
        },
        include: {
          test: {
            include: {
              questions: true
            }
          }
        }
      });

      // If no test attempt is not found return an error
      if(!testAttempt) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Test attempt not found"
        });
      }

      const explanation = await ctx.db.explanation.findFirst({
        where: {
          testAttemptId: testAttemptId,
          text: explanationText,
        }
      });
      
      if(explanation === null || explanation === undefined) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Explanation not found"
        });
      }

      let isCorrect = 0;

      for (const question of testAttempt.test.questions) {
        
        // If an existing answer is found add it to the computed answers without querying AI
        const existingAnswer = await ctx.db.answer.findFirst({
          where: {
            questionId: question.id,
            explanationId: explanation.id
          }
        });

        isCorrect += existingAnswer?.isCorrect ? 1 : 0;
      }

      if (isCorrect !== input.numberCorrect) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "There is a mismatch in the number of correct answers."
        });
      }

      const progress = isCorrect / testAttempt.test.questions.length;
      const updatedTestAttempt = await ctx.db.testAttempt.update({
        where: {
          id: testAttemptId
        },
        data: {
          progress: progress,
          endTime: new Date()
        }
      });

      return {
        id: updatedTestAttempt.id,
        progress: updatedTestAttempt.progress,
        endTime: updatedTestAttempt.endTime ?? new Date()
      };
    })

});
