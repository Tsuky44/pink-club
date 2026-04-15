import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const discordEnabled =
  !!process.env.DISCORD_CLIENT_ID && !!process.env.DISCORD_CLIENT_SECRET;

// Optional: Guild ID of your GTA RP server to fetch nicknames
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID;

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    ...(discordEnabled
      ? [
          DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
            authorization: {
              params: {
                scope: "identify guilds guilds.members.read",
              },
            },
            async profile(profile, tokens) {
              // Default to Discord global name or username
              let displayName = profile.global_name || profile.username;

              // If guild ID is configured, try to fetch the member's nickname
              if (DISCORD_GUILD_ID && tokens.access_token) {
                try {
                  const memberRes = await fetch(
                    `https://discord.com/api/v10/users/@me/guilds/${DISCORD_GUILD_ID}/member`,
                    {
                      headers: {
                        Authorization: `Bearer ${tokens.access_token}`,
                      },
                    }
                  );
                  if (memberRes.ok) {
                    const member = await memberRes.json();
                    // Use nickname if available, otherwise keep global name
                    if (member.nick) {
                      displayName = member.nick;
                    }
                  }
                } catch {
                  // Fall back to global name if API fails
                }
              }

              return {
                id: profile.id,
                name: displayName,
                email: null, // No email collected
                image: profile.avatar
                  ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
                  : `https://cdn.discordapp.com/embed/avatars/${(parseInt(profile.id) >> 22) % 6}.png`,
                username: displayName,
                discordId: profile.id,
              };
            },
          }),
        ]
      : []),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        login: { label: "Pseudo ou Email", type: "text" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.login || !credentials?.password) return null;

        const login = credentials.login as string;

        // Find by username or email
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { username: login },
              { email: login },
            ],
          },
        });

        if (!user || !user.password) return null;

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!passwordMatch) return null;

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
});
