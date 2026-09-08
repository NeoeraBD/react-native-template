import { useState } from "react";
import { useForm } from "react-hook-form";
import { useStores, AuthRepository } from "@app/core";

export const useLoginViewModel = () => {
  const { authStore } = useStores();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submitLogin = async (): Promise<string | null> => {
    let error: string | null = null;

    await handleSubmit(async (data) => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const result = await AuthRepository.login(data.email, data.password);
        authStore.login(result.email, result.name, result.token);
      } catch (e: any) {
        error = e.message || "Login failed";
        setErrorMessage(error);
      } finally {
        setIsLoading(false);
      }
    })();

    return error;
  };

  return {
    control,
    errors,
    isLoading,
    errorMessage,
    submitLogin,
    clearError: () => setErrorMessage(null),
  };
};

export default useLoginViewModel;
