import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import nodemailer from 'nodemailer';

const generateOTP = () => {
  return Math.floor(10000000 + Math.random() * 90000000).toString(); 
};

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(z.object({
      name: z.string().min(3),
      email: z.string().email(),
      password: z.string().min(6),
    }))
    .mutation(async ({ input, ctx }) => {
      const otp = generateOTP();

      // Send OTP via email
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: input.email,
        subject: 'Verify Your Email',
        text: `Your OTP is: ${otp}`,
      });

   
      await ctx.db.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: await hash(input.password, 10),
          otp: otp,
          otpAttempts: 0,
          verified: false,
        },
      });

      return { message: 'OTP sent to your email' };
    }),

  verifyOtpAndCreateUser: publicProcedure
    .input(z.object({
      email: z.string().email(),
      otp: z.string().length(8),
    }))
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        throw new Error("User not found");
      }

      if (user.otpAttempts >= 2 ) {
     
        await ctx.db.user.delete({
          where: { email: input.email },
        });
        throw new Error('Too many invalid attempts. Please try to create an account again.');
      }

      if (user.otp !== input.otp) {
      
        await ctx.db.user.update({
          where: { email: input.email },
          data: { otpAttempts: user.otpAttempts + 1 },
        });
        const attemptsLeft = 2 - user.otpAttempts;
        throw new Error(`Invalid OTP. You have ${attemptsLeft} attempts left.`);
      }

      await ctx.db.user.update({
        where: { email: input.email },
        data: { otp: null, otpAttempts: 0, verified: true },
      });

      return { message: "Email verified successfully" };
    }),

  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { email: input.email },
      });
      if (!user) {
        throw new Error("Invalid email or password");
      }
      if (!user.verified) {
        throw new Error("Please verify your email to log in");
      }
      const isValid = await compare(input.password, user.password);
      if (!isValid) {
        throw new Error("Invalid email or password");
      }
      const token = sign({ id: user.id }, process.env.JWT_SECRET!, {
        expiresIn: "2h",
      });

      ctx.res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/`);

      return { token, message: "Login successful" };
    }),



 
});
