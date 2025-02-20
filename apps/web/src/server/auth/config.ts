import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { logAuthenticationError, validatePassword } from "@web/server/api/auth";
import { db } from "@web/server/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@web/server/db/schema";
import { and, count, eq } from "drizzle-orm";
import NextAuth, {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import type { Adapter } from "next-auth/adapters";
import { type Provider } from "next-auth/providers";
import CredentialsProvider from "next-auth/providers/credentials";
import requestIp from "request-ip";

type UserRole = "admin" | "user";

declare module "next-auth/jwt" {
  export interface JWT {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  export interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  export interface DefaultUser {
    role: UserRole | null;
  }
}

/**
 * Returns true if the user table is empty, which indicates that this user is going to be
 * the first one. This can be racy if multiple users are created at the same time, but
 * that should be fine.
 */
async function isFirstUser(): Promise<boolean> {
  const [{ count: userCount } = { count: 0 }] = await db
    .select({ count: count() })
    .from(users);
  return userCount == 0;
}

/**
 * Returns true if the user is an admin
 */
async function isAdmin(email: string): Promise<boolean> {
  const res = await db.query.users.findFirst({
    columns: { role: true },
    where: eq(users.email, email),
  });
  return res?.role == "admin";
}

const providers: Provider[] = [
  CredentialsProvider({
    // The name to display on the sign in form (e.g. "Sign in with...")
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email", placeholder: "Email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials, req) {
      if (!credentials) {
        return null;
      }

      try {
        return await validatePassword(
          credentials?.email,
          credentials?.password,
        );
      } catch (e) {
        const error = e as Error;
        logAuthenticationError(
          credentials?.email,
          error.message,
          requestIp.getClientIp({ headers: req.headers }),
        );
        return null;
      }
    },
  }),
];

export const authOptions: NextAuthOptions = {
  // https://github.com/nextauthjs/next-auth/issues/9493
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }) as Adapter,
  providers: providers,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
    signOut: "/signin",
    error: "/signin",
    newUser: "/signin",
  },
  callbacks: {
    async signIn({ credentials, profile }) {
      if (credentials) {
        return true;
      }
      if (!profile?.email) {
        throw new Error("No profile");
      }
      const [{ count: userCount } = { count: 0 }] = await db
        .select({ count: count() })
        .from(users)
        .where(and(eq(users.email, profile.email)));

      // If it's a new user and signups are disabled, fail the sign in
      if (userCount === 0) {
        throw new Error("Signups are disabled in server config");
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role ?? "user",
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = { ...token.user };
      return session;
    },
  },
};

export const authHandler = NextAuth(authOptions);

export const getServerAuthSession = () => getServerSession(authOptions);
