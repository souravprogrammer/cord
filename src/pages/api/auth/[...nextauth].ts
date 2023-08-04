import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import Providers from "next-auth/providers"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
// import MongoDBClient from "@/Utils/MongoDBClient";
import clientPromise from "@/lib/Client"
import dbConnect from '@/lib/MongoClient';
import { User } from "@/Model/user/User"




export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        GithubProvider({
            clientId: process.env.NEXTAUTH_GIT_CI as string,
            clientSecret: process.env.NEXTAUTH_GIT_SECRET as string,
        }),
        CredentialsProvider({
            id: "auth",
            name: 'credentials',
            credentials: {
                email: { label: "Email", type: "text", placeholder: "specter@gmail.com" },
                // name: { label: "Full Name", type: "text", placeholder: "Mike Ross" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                await dbConnect()
                const verifiedUser = await User.findOne({ email: credentials?.email, password: credentials?.password }, { password: 0 })
                return verifiedUser;
            }
        })
        // ...add more providers here
    ],
    adapter: MongoDBAdapter(clientPromise),
    session: {
        strategy: "jwt",
    },
    callbacks: {

        session: async ({ session, user, token }: any) => {
            // console.log(">> ", token)
            if (session?.user) {
                session.user.id = user?.id ?? token?.sub;
            }
            return session;
        },

    },


    secret: process.env.NEXTAUTH_SECRET,
};
export default NextAuth(authOptions as any);
