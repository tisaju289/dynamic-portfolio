import { useUser, useClerk } from "@clerk/react";

export const useAuth = () => {
  const { user, isLoaded } = useUser();
  const { signOut: clerkSignOut } = useClerk();

  return {
    user: user ? { id: user.id, email: user.primaryEmailAddress?.emailAddress } : null,
    loading: !isLoaded,
    signIn: async (_email: string, _password: string) => {
      return { data: null, error: { message: "Use the sign-in page at /sign-in" } };
    },
    signOut: () => clerkSignOut({ redirectUrl: "/" }),
  };
};
