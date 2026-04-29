import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "@/db"
import { profiles } from "@/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit"

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null

        const ip = req.headers?.["x-forwarded-for"] ?? "unknown"
        const key = getRateLimitKey(ip as string, "login")
        const limit = rateLimit(key, { windowMs: 15 * 60 * 1000, max: 5 })

        if (!limit.success) {
          throw new Error("Terlalu banyak percobaan login. Coba lagi nanti.")
        }

        const [user] = await db
          .select()
          .from(profiles)
          .where(eq(profiles.email, credentials.email))
          .limit(1)
        if (!user) return null
        const valid = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!valid) return null
        return { id: user.id, name: user.fullName, email: user.email }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string
      return session
    },
  },
  pages: {
    signIn: "/masuk",
  },
}
