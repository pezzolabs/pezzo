import { INTERCOM_APP_ID } from "src/env";
import React from "react";
import { IntercomProvider } from "react-use-intercom";
import { useAuthContext } from "./AuthProvider";

export const OptionalIntercomProvider = ({
  children,
}: {
  children: React.ReactNode | string;
}): JSX.Element => {
  const { currentUser } = useAuthContext();
  if (INTERCOM_APP_ID) {
    return (
      <IntercomProvider
        appId={INTERCOM_APP_ID}
        autoBoot
        autoBootProps={{
          email: currentUser.email,
          name: currentUser?.name,
          userId: currentUser.id,
        }}
      >
        {children}
      </IntercomProvider>
    );
  }
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};
