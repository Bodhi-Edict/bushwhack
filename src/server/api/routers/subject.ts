import { type Subject } from "@prisma/client";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const subjectRouter = createTRPCRouter({

  getAll: publicProcedure.query(({ ctx }):Promise<Subject[]> => {
    return ctx.db.subject.findMany();
  }),
});
