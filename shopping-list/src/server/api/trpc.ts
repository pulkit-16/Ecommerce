/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { initTRPC, TRPCError } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { ZodError } from "zod";
import { UserJwtPayload, verifyAuth } from "~/lib/auth";

import { db } from "~/server/db";


type CreateContextOptions = Record<string, never>;


const createInnerTRPCContext = (_opts: CreateContextOptions) => {
  return {
    db,
  };
};
export const createTRPCContext = async (_opts: CreateNextContextOptions) => {
  const { req,res } = _opts;
  const token = req.cookies.token || null;
  let user : UserJwtPayload|null=null;

  if (token) {
    try {
      user = await verifyAuth(token);
    } catch (error) {
      console.log('Token verification failed:', error);
    }
  }

  return {
    ...createInnerTRPCContext({}),
    user,
    req,
    res
  };
};

// export const createTRPCContext = (_opts: CreateNextContextOptions) => {
//   return createInnerTRPCContext({});
// };


const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});




export const createCallerFactory = t.createCallerFactory;


export const createTRPCRouter = t.router;


export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(isAuthenticated);
