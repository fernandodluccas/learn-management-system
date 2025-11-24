import { PrismaClient } from "@/generated/prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

const prisma = new PrismaClient();

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
    },
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins: ["https://learn-management-system-seven.vercel.app/"],
    plugins: [nextCookies()]
});