export interface LoginResponse {
  email: string;
  name: string;
  token: string;
}

export const AuthRepository = {
  /**
   * Simulates authentication verification. Resolves user payload on success.
   */
  login: async (email: string, _password?: string): Promise<LoginResponse> => {
    // Simulate API delay
    await new Promise<void>((resolve) => setTimeout(resolve, 1500));

    if (!email.includes('@')) {
      throw new Error('Invalid email address format');
    }

    return {
      email,
      name: email.split('@')[0],
      token: 'mock-jwt-token-xyz',
    };
  },
};

export default AuthRepository;
