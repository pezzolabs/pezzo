import { hotjar } from "react-hotjar";
import {createContext, useContext, useEffect, useMemo, useState} from "react";
import {useGetCurrentUser, useGetUserByEmail} from "~/graphql/hooks/queries";
import { GetMeQuery } from "~/@generated/graphql/graphql";
import { useIdentify } from "~/lib/utils/analytics";
import {useNavigate} from "react-router-dom";
import {FullScreenLoader} from "~/components/common/FullScreenLoader";
import {AuthCallbackPage} from "~/pages/auth/AuthCallbackPage";

const AuthProviderContext = createContext<{
  currentUser: GetMeQuery["me"];
  isLoading: boolean;
}>({
  currentUser: undefined,
  isLoading: false,
});

export const useAuthContext = () => useContext(AuthProviderContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const { data, isLoading, isSuccess, error, isError } = useGetCurrentUser();
  if (data.me.id === "") {
    console.error("User not exist in LLM Ops, please register firstly.");
    // navigate to register page after user first SSO login
    navigate(`/login/callback/${data.me.email}`);
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
      {!isLoading && data.me.id === "" && <AuthCallbackPage />}
      {data.me.id !== "" && children}
    </AuthProviderContext.Provider>
  );
};
