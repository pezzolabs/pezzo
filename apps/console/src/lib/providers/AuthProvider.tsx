import { hotjar } from "react-hotjar";
import { createContext, useContext, useEffect, useMemo } from "react";
import { useGetCurrentUser } from "~/graphql/hooks/queries";
import { GetMeQuery } from "~/@generated/graphql/graphql";
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
  const { data, isLoading } = useGetCurrentUser();

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
      {children}
    </AuthProviderContext.Provider>
  );
};
