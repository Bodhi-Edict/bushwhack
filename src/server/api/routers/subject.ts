import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { type SubjectsPage, type SubjectPage } from "~/types/apiResponse.types";
import { Decimal } from "@prisma/client/runtime/library";

export const subjectRouter = createTRPCRouter({

  getAll: publicProcedure.query(({ ctx }):Promise<SubjectsPage> => {
    return ctx.db.subject.findMany({
      select: {
        name: true,
        description: true,
        iconUrl: true,
        slug: true,
        id: true
      }
    });
  }),

  getSubject: publicProcedure
    .input(z.object({
      slug: z.string({
          required_error: "Query is required"
      }),
    }))
    .mutation(async ({ ctx, input }):Promise<SubjectPage> => {
      const slug = input.slug;
      const subject = await ctx.db.subject.findUnique({
        where: {
            slug: slug
        },
        include: {
          tests: {
            include: {
              testAttempts: {
                select: {
                  id: true, 
                  progress: true
                },
                where: {
                  userId: ctx.session?.user ? ctx.session.user.id : undefined
                }
              },
            }
          },
        }
      });
      if (!subject) {
        throw new Error("Subject not found");
      }
      const tests = subject.tests.map((test) => {
        const attempts = test.testAttempts.length;
        let progress = new Decimal(0.0);
        test.testAttempts.map((attempt) => {
          if(progress < attempt.progress) {
            progress = attempt.progress;
          }
        });
        return {
          name: test.name,
          id: test.id,
          imageUrl: test.imageUrl,
          maxTimeInMins: test.maxTimeInMins,
          attempts,
          progress,
        };
      });
      const subjectWithProgress = { name: subject.name, description: subject.description, iconUrl: subject.iconUrl, tests };
      return subjectWithProgress;
    }),
});
