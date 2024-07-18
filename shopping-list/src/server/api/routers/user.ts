import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import nodemailer from 'nodemailer';

const generateOTP = () => {
  return Math.floor(10000000 + Math.random() * 90000000).toString(); // 8-digit OTP
};

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(z.object({
      name: z.string().min(3),
      email: z.string().email(),
      password: z.string().min(6),
    }))
    .mutation(async ({ input, ctx }) => {
      const hashedPassword = await hash(input.password, 10);
      const otp = generateOTP();

      const user = await ctx.db.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashedPassword,
          otp, // Store the OTP in the user record
        },
      });

      // Send OTP via email
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USER, // Use your email credentials
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER, // The email you use to send emails
        to: input.email, // The user's email
        subject: 'Verify Your Email',
        text: `Your OTP is: ${otp}`,
      });

      return user;
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

  verifyOtp: publicProcedure
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
      if (user.otp !== input.otp) {
        throw new Error("Invalid OTP");
      }

      await ctx.db.user.update({
        where: { email: input.email },
        data: { otp: null }, // Clear OTP after successful verification
      });

      return { message: "Email verified successfully" };
    }),
});
