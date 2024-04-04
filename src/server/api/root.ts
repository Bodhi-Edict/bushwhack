import { createTRPCRouter } from "~/server/api/trpc";
import { subjectRouter } from "./routers/subject";
import { testRouter } from "./routers/test";
import { answerRouter } from "./routers/answer";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  subject: subjectRouter,
  test: testRouter,
  answer: answerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
