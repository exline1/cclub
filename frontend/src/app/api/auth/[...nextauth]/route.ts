import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email/Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Bu joyda asil API orqali backendga (masalan /api/auth/login) so'rov yuborilishi kerak.
        // Hozirgi holat uchun xavfsiz mock logic:
        
        const { identifier, password } = credentials ?? {};
        if (!identifier || !password) return null;

        try {
          const res = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              phone: identifier.includes("@") ? undefined : identifier,
              email: identifier.includes("@") ? identifier : undefined,
              password,
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            // Error handling matching backend errors
            if (data?.error?.message === "PENDING_APPROVAL") {
              throw new Error("PENDING_APPROVAL");
            }
            if (data?.error?.message?.startsWith("APPLICATION_REJECTED")) {
              throw new Error(data.error.message);
            }
            throw new Error(data?.error?.message || "Login xatosi");
          }

          if (data && data.user) {
            return {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              role: data.user.role,
              accessToken: data.accessToken,
            };
          }
          return null;
        } catch (err: any) {
          throw new Error(err.message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // @ts-ignore
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // O'zimizning custom login sahifamiz
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "cclub-super-secret-key-2026",
});

export { handler as GET, handler as POST };
