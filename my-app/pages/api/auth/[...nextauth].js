import NextAuth from "next-auth";

const makeTokenRequest = async (context) =>
  fetch(
    `${context.provider.token.url}?code=${context.params.code}&client_id=${context.client.client_id}&client_secret=${context.client.client_secret}`
  ).then((res) => res.json());

const makeUserInfoRequest = async (context) =>
  fetch(
    `${context.provider.userinfo.url}?client_secret=${context.client.client_secret}&token=${context.tokens.access_token}`
  ).then((res) => res.json());

/**
 * NextAuth.js configuration. See https://next-auth.js.org/configuration/initialization for details.
 * We use a custom OAuth provider to point NextAuth.js towards UCL API's OAuth system.
 * We also use NextAuth.js callbacks to ensure only Engineering users can login, and to grant admin privileges.
 */
export default NextAuth({
  providers: [
    {
      id: "uclapi",
      name: "UCL API",
      params: { grant_type: "authorization_code" },
      type: "oauth",
      authorization: "https://uclapi.com/oauth/authorise",
      token: {
        url: "https://uclapi.com/oauth/token",
        async request(context) {
          const tokens = await makeTokenRequest(context);
          return { tokens };
        },
      },
      userinfo: {
        url: "https://uclapi.com/oauth/user/data",
        async request(context) {
          return await makeUserInfoRequest(context);
        },
      },
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.cn,
          name: profile.full_name,
          email: profile.email,
          image: "",
        };
      },
    },
  ],
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log("a", token, "b", user, "c", account, "d", profile);
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token, user }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  session: {
    maxAge: 24 * 60 * 60, // One day idle session expiry
  },
});