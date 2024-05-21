import {createContext, useContext, useEffect, useMemo, useState} from "react";
import {useGetCurrentUser, useGetUserByEmail} from "~/graphql/hooks/queries";
import { GetMeQuery } from "~/@generated/graphql/graphql";
import { useIdentify } from "~/lib/utils/analytics";
import {FullScreenLoader} from "~/components/common/FullScreenLoader";
import {AuthCallbackPage} from "~/pages/auth/AuthCallbackPage";
import {Alert, AlertDescription, AlertTitle} from "@pezzo/ui";
import {AlertCircle} from "lucide-react";

const AuthProviderContext = createContext<{
  currentUser: GetMeQuery["me"];
  isLoading: boolean;
}>({
  currentUser: undefined,
  isLoading: false,
});

export const useAuthContext = () => useContext(AuthProviderContext);

export const AuthProvider = ({ children }) => {

  const { data, isLoading, isSuccess, error, isError } = useGetCurrentUser();
  if (data.me.id === "") {
    console.info("User not exist in LLM Ops, please register firstly.");
    // navigate to register page after user first SSO login
    // navigate(`/login/callback/${data.me.email}`);
    window.location.href = `/login/callback/${data.me.email}`;
  }

  const value = useMemo(
    () => ({
      currentUser: data?.me,
      isLoading,
    }),
    [data, isLoading]
  );

  // useEffect(() => {
  //   if (hotjar.initialized() && value.currentUser) {
  //     hotjar.identify(value.currentUser.id, {
  //       name: value.currentUser?.name,
  //       email: value.currentUser?.email,
  //     });
  //   }
  // }, [value.currentUser]);


  useIdentify(value.currentUser);

  return (

    <AuthProviderContext.Provider value={value}>
      {isLoading && <FullScreenLoader />}
      {!isLoading && data.me.id === "" &&
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>User not exist in LLM Ops</AlertTitle>
          <AlertDescription>
            Will redirect to register page...
          </AlertDescription>
        </Alert>}
      {data.me.id !== "" && children}
    </AuthProviderContext.Provider>
  );
};
