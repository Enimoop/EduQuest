import { NuxtAuthHandler } from "#auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import ModeleProfil from "~/model/ModeleProfil.mjs";

export default NuxtAuthHandler({
  pages: {
    signIn: "/login",
  },
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    GithubProvider.default({
      clientId: "d190bf5753c00df53a24",
      clientSecret: "752c62a5ee472fb2ff0f11fa6a726957a5df13ee",

      // clientId: useRuntimeConfig.public.GITHUB_CLIENT_ID,
      // clientSecret: useRuntimeConfig.GITHUB_CLIENT_SECRET,
    }),

    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    CredentialsProvider.default({
      name: "Credentials",

      async authorize(credentials: any) {
        //Pas safe pour la prod

        const modele = new ModeleProfil();
        const user = await new Promise<any>((resolve, reject) => {
          modele.recupererUnCompte(credentials.email, (err: any, user: any) => {
            if (err) reject(err);
            else resolve(user);
          });
        });

        if (user == null) return null;

        if (user.mdp === credentials.password) return user;
      },
    }),
  ],
});
