import { createAuthClient } from "better-auth/react";

import { inferAdditionalFields } from "better-auth/client/plugins";
import { auth } from "./auth";

const { useSession, signIn, signOut, getSession, updateUser, signUp } =
  createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
    plugins: [inferAdditionalFields<typeof auth>()],
  });

export { signOut, useSession, signIn, getSession, updateUser, signUp };
