import styled from "@emotion/styled";
import { hotjar } from "react-hotjar";
import { createContext, useContext, useEffect, useMemo } from "react";
import { useGetCurrentUser } from "~/graphql/hooks/queries";
import { GetMeQuery } from "~/@generated/graphql/graphql";
import { LayoutWrapper } from "~/components/layout/LayoutWrapper";
import { Loader } from "~/components/common/Loader";
import { useIdentify } from "~/lib/utils/analytics";

const AuthProviderContext = createContext<{
  currentUser: GetMeQuery["me"];
  isLoading: boolean;
}>({
  currentUser: undefined,
  isLoading: false,
});

export const useAuthContext = () => useContext(AuthProviderContext);

export const AuthProvider = ({ children }) => {
  const { data, isLoading, isError } = useGetCurrentUser();

  const value = useMemo(
    () => ({
      currentUser: data?.me,
      isLoading,
    }),
    [data, isLoading]
  );

  useEffect(() => {
    if (hotjar.initialized() && value.currentUser) {
      hotjar.identify(value.currentUser.id, {
        name: value.currentUser?.name,
        email: value.currentUser?.email,
      });
    }
  }, [value.currentUser]);

  useIdentify(value.currentUser);

  return (
    <AuthProviderContext.Provider value={value}>
      {isLoading || isError || !data ? (
        <LayoutWrapper>
          <div className="h-100vh flex items-center justify-center">
            {isLoading ? <Loader /> : <p>Something went wrong</p>}
          </div>
        </LayoutWrapper>
      ) : (
        children
      )}
    </AuthProviderContext.Provider>
  );
};
