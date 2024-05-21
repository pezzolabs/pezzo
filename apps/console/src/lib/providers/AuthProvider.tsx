import { hotjar } from "react-hotjar";
import {createContext, useContext, useEffect, useMemo, useState} from "react";
import { useGetCurrentUserWithHeader } from "~/graphql/hooks/queries";
import { GetMeQuery } from "~/@generated/graphql/graphql";
import { useIdentify } from "~/lib/utils/analytics";
import {useNavigate} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {gqlClient} from "~/lib/graphql";
import {GET_ME} from "~/graphql/definitions/queries/users";

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
  const [email, setEmail] = useState<string | null>(null);

  const oktaUrl = "/oauth2/userinfo";

  useEffect(() => {
    // get current user email from okta
    fetch(oktaUrl, {
      method: "GET",
    }).then((res) => {
      if (res.ok) {
        res.json().then((resp) => {
          console.log("email: " + resp.email);
          setEmail(resp.email);
        });
      } else {
        console.error(`error message: ${res.text()}`);
      }
    });
  });

  const { data, isLoading, error }  =
    useQuery({ queryKey: ["me"], queryFn: () => gqlClient.request(GET_ME, {}, {"email": email}), enabled: !!email });

  // const { data, isLoading, error } = useGetCurrentUserWithHeader(email);
  if (error) {
    console.error("Error fetching current user ", error);
    // navigate to register page after user first SSO login
    navigate(`/login/callback/${email}`);
  }
  // const { data, isLoading } = useGetCurrentUser();

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
