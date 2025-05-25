import {
  useClearSessionCookieMutation,
  useFindProfileQuery,
} from "@/graphql/generated/output";
import { useAuth } from "./useAuth";
import { useEffect } from "react";

export const useCurrent = () => {
  const { isAuthenticated, exit } = useAuth();

  const { data, loading, refetch, error } = useFindProfileQuery({
    skip: !isAuthenticated,
  });

  const [clearCookie] = useClearSessionCookieMutation();

  if (error) {
    if (isAuthenticated) {
      clearCookie();
    }
    exit();
  }

  useEffect(() => {
    if (error) {
      if (isAuthenticated) {
        clearCookie();
      }
      exit();
    }
  }, [isAuthenticated, exit, clearCookie, error]);

  return {
    user: data?.findProfile,
    isLoadingProfile: loading,
    refetch,
  };
};
