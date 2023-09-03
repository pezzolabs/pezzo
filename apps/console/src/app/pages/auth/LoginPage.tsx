import BlurryBlurb from "../../../assets/blurry-blurb.svg";
import Spline from "@splinetool/react-spline";
import { useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  FormItem,
  FormMessage,
  Input,
} from "@pezzo/ui";
import GoogleIcon from "../../../assets/icons/google.svg";
import { thirdPartySignIn } from "../../lib/auth/supertokens";
import ThirdPartyEmailPassword from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import { Form, FormField } from "@pezzo/ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";

const GENERIC_ERROR = "Something went wrong. Please try again later.";

const emailPasswordFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, "Password is required"),
});

export const LoginPage = () => {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot_password">("signin");
  const [isEmail, setIsEmail] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [emailPasswordLoading, setEmailPasswordLoading] =
    useState<boolean>(false);
  const [thirdPartyLoading, setThirdPartyLoading] = useState<boolean>(false);

  const emailPasswordForm = useForm<z.infer<typeof emailPasswordFormSchema>>({
    resolver: zodResolver(emailPasswordFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onEmailPasswordSubmit = async (
    values: z.infer<typeof emailPasswordFormSchema>
  ) => {
    setEmailPasswordLoading(true);
    await emailPasswordSignIn(values.email, values.password);
    setEmailPasswordLoading(false);
  };

  const handleThirdPartySignIn = async (providerId: "google") => {
    setError(null);
    setThirdPartyLoading(true);

    try {
      await thirdPartySignIn(providerId);
    } catch (error) {
      setError(GENERIC_ERROR);
    }
  };

  const emailPasswordSignIn = async (email: string, password: string) => {
    const response = await ThirdPartyEmailPassword.emailPasswordSignIn({
      formFields: [
        {
          id: "email",
          value: email,
        },
        {
          id: "password",
          value: password,
        },
      ],
    });

    if (response.status === "WRONG_CREDENTIALS_ERROR") {
      // the input email / password combination did not match,
      // so we show an appropriate error message to the user
      setError("Invalid email or password. Please try again.");
      return;
    }
    if (response.status === "FIELD_ERROR") {
      response.formFields.forEach((item) => {
        if (item.id === "email") {
          // this means that something was wrong with the entered email.
          // probably that it's not a valid email (from a syntax point of view)
          setError(item.error);
        } else if (item.id === "password") {
          setError(item.error);
        }
      });

      return;
    }

    window.location.assign("/");
  };

  return (
    <div className="flex min-h-full flex-1 overflow-hidden">
      <div className="z-10 flex flex-1 flex-col justify-center bg-neutral-900 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center">
            <img
              className="inline-block h-20 w-auto"
              src="https://cdn.pezzo.ai/logo-square-transparent-bg.png"
              alt="Your Company"
            />
            <h2 className="font-heading mt-8 text-3xl font-medium leading-9 tracking-tight">
              Sign in to Pezzo{" "}
            </h2>
          </div>

          <div className="mb-4 mt-6">
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Oops!</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="mt-2 flex flex-col space-y-2">
            <Button
              size="lg"
              className="w-full bg-neutral-200 text-neutral-800 hover:bg-neutral-200 hover:text-neutral-700"
              onClick={() => handleThirdPartySignIn("google")}
              loading={thirdPartyLoading}
            >
              <img src={GoogleIcon} alt="Google Logo" className="mr-3 h-5" />
              Continue with Google
            </Button>

            <motion.div
              key={[mode, isEmail].join("_")}
              initial={{ height: 10, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {mode !== "signup" && isEmail && (
                <>
                  <div className="-mt-2 py-4">
                    <div className="h-px w-full bg-neutral-700"></div>
                  </div>

                  <Form {...emailPasswordForm}>
                    <form
                      onSubmit={emailPasswordForm.handleSubmit(
                        onEmailPasswordSubmit
                      )}
                      className="flex flex-col space-y-3"
                    >
                      <FormField
                        control={emailPasswordForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <Input
                              {...field}
                              size="lg"
                              type="email"
                              placeholder="Email"
                              className="w-full"
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={emailPasswordForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <Input
                              {...field}
                              size="lg"
                              type="password"
                              placeholder="Password"
                              className="w-full"
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        size="lg"
                        variant="outline"
                        className="mb-2 w-full"
                        loading={emailPasswordLoading}
                      >
                        Continue with Email
                      </Button>
                    </form>
                  </Form>
                </>
              )}
            </motion.div>

            {mode !== "signup" && !isEmail && (
              <Button
                size="lg"
                variant="outline"
                className="mb-2 w-full"
                loading={emailPasswordLoading}
                onClick={() => setIsEmail(true)}
              >
                Continue with Email
              </Button>
            )}
          </div>

          <motion.div
            key={mode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {mode === "signin" ? (
              <p className="text-center text-sm leading-6 mt-2">
                Don't have an account?{" "}
                <Button
                  variant="link"
                  onClick={() => setMode("signup")}
                  className="px-0"
                >
                  Sign up
                </Button>
                .
              </p>
            ) : (
              <p className="text-center text-sm leading-6">
                or{" "}
                <Button
                  variant="link"
                  onClick={() => {
                    setMode("signin");
                    setIsEmail(true);
                  }}
                  className="px-0"
                >
                  sign in with email
                </Button>
              </p>
            )}
          </motion.div>
        </div>
      </div>
      <div className="relative flex h-[100vh] flex-1 bg-neutral-950 lg:block hidden">
        <div className="flex h-full w-full items-center justify-center">
          <div
            className="pointer-events-none absolute -mt-36 translate-x-[0vw] translate-y-[10vh] scale-[110%] opacity-50 blur-2xl md:block"
            aria-hidden="true"
          >
            <img
              src={BlurryBlurb}
              className="h-[100vh] w-[100vw] object-cover"
              alt="Page Illustration"
            />
          </div>
          <div className="z-10 inline-block">
            <Spline scene="https://prod.spline.design/qwBMirz3eudaCbeJ/scene.splinecode" />
          </div>
        </div>
      </div>
    </div>
  );
};
