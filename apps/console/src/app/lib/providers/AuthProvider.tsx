import styled from "@emotion/styled";
import { hotjar } from "react-hotjar";
import { Col, Empty, Row } from "antd";
import { createContext, useContext, useEffect, useMemo } from "react";
import { useGetCurrentUser } from "../hooks/queries";
import { GetMeQuery } from "@pezzo/graphql";
import { LayoutWrapper } from "../../components/layout/LayoutWrapper";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { colors } from "../theme/colors";

const SpinnerOverlay = styled(Row)`
  height: 100%;
`;

SpinnerOverlay.defaultProps = {
  justify: "center",
  align: "middle",
};

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

  return (
    <AuthProviderContext.Provider value={value}>
      {isLoading || isError || !data ? (
        <LayoutWrapper withSideNav={false} withHeader={false}>
          <Row justify="center" align="middle" style={{ height: "100%" }}>
            <Col>
              {isLoading ? (
                <Loading3QuartersOutlined
                  style={{ fontSize: 102, color: colors.indigo[400] }}
                  spin
                />
              ) : (
                <Empty description="Something went wrong" />
              )}
            </Col>
          </Row>
        </LayoutWrapper>
      ) : (
        children
      )}
    </AuthProviderContext.Provider>
  );
};
