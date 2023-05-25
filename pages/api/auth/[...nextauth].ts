import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from 'next-auth'
import prisma from "@/prisma"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID || "",
            clientSecret: process.env.GITHUB_SECRET || "",
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "database",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        updateAge: 2 * 60, // 2 hours,
    },
    callbacks: {
        async signIn({ account, profile }) {
            if (account?.provider === 'github' && profile?.email === process.env.ADMIN_EMAIL) {
                return true
            } else {
                return false
            }
        }
    }
}

export default NextAuth(authOptions);
