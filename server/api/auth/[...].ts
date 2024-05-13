import { NuxtAuthHandler } from "#auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import ModeleProfil from "~/model/ModeleProfil.mjs";
import axios from 'axios';

export default NuxtAuthHandler({
  secret:"secret",
  
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

      async authorize(credentials : any) {
        try {
          const response = await axios.get(`http://localhost:3001/profils/${credentials.email}`);
          const user = response.data;
          // Vérifiez les informations d'identification ici et retournez l'utilisateur si elles sont valides
          return user;
        } catch (error) {
          console.error("Error retrieving user:", error);
          throw new Error("Error retrieving user");
        }
      },
    }),
  ],
});
