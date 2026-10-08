export const lovable = {
  auth: {
    signInWithOAuth: async (
      _provider: string,
      _options?: { redirect_uri?: string },
    ): Promise<{ error?: { message?: string } | null; redirected?: boolean }> => {
      return { redirected: false, error: null };
    },
  },
};
