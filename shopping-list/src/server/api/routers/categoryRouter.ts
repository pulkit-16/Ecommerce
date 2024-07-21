import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const categoryRouter = createTRPCRouter({
  getPaginatedCategories: protectedProcedure
    .input(z.object({
      page: z.number().min(1),
      perPage: z.number().min(1).max(100),
    }))
    .query(async ({ ctx, input }) => {
      const categories = await ctx.db.category.findMany({
        skip: (input.page - 1) * input.perPage,
        take: input.perPage,
      });
      const totalCount = await ctx.db.category.count();
      return {
        categories,
        totalCount,
      };
    }),
  
  markCategory: protectedProcedure
    .input(z.object({
      categoryId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.user.id },
        select: { selectedCategoryIds: true },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const updatedSelectedCategoryIds = user.selectedCategoryIds.includes(input.categoryId)
        ? user.selectedCategoryIds.filter(id => id !== input.categoryId)
        : [...new Set([...user.selectedCategoryIds, input.categoryId])];

      await ctx.db.user.update({
        where: { id: ctx.user.id },
        data: {
          selectedCategoryIds: updatedSelectedCategoryIds,
        },
      });

      return { selectedCategoryIds: updatedSelectedCategoryIds };
    }),

  getUserCategories: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.user.id },
      select: { selectedCategoryIds: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const categories = await ctx.db.category.findMany({
      where: {
        id: {
          in: user.selectedCategoryIds,
        },
      },
    });

    return categories;
  }),

  
  logout: protectedProcedure.mutation(async ({ ctx }) => {
    ctx.res.setHeader('Set-Cookie', 'token=; path=/; ');
    return { message: 'Logout successful' };
  }),
});
