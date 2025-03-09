import Lottie from "lottie-react";
import LogoLoader from "src/assets/logo-loader.json";

export const Loader = () => {
  return (
    <Lottie style={{ width: 200 }} animationData={LogoLoader} loop={true} />
  );
};
