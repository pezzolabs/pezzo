import BlurryBlurb from "~/assets/blurry-blurb.svg";
import Spline from "@splinetool/react-spline";
import { useEffect, useState } from "react";
import { usePageTitle } from "~/lib/hooks/usePageTitle";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  FormItem,
  FormMessage,
  Input,
} from "@pezzo/ui";
import GoogleIcon from "~/assets/icons/google.svg";
import ThirdPartyEmailPassword from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import { Form, FormField } from "@pezzo/ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { trackEvent } from "~/lib/utils/analytics";
import { googleEnabled } from "~/lib/auth/supertokens";

const GENERIC_ERROR = "Something went wrong. Please try again later.";

export const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot_password">(
    "signin"
  );
  const [isEmail, setIsEmail] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [emailPasswordLoading, setEmailPasswordLoading] =
    useState<boolean>(false);
  const [thirdPartyLoading, setThirdPartyLoading] = useState<boolean>(false);
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);

  const verb = mode === "signin" ? "Sign in" : mode === "signup" ? "Sign up" : "Reset password";
  usePageTitle(verb);
  const signInSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, "Password is required"),
    confirm_password: mode === "signup" ? z.string() : z.string().optional(),
  });

  const signUpSchema = z
    .object({
      email: z.string().email({ message: "Invalid email address" }),
      password: z
        .string()
        .regex(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\-]).{8,}$/,
          "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special symbol"
        ),
      confirm_password: z.string().min(1, "Confirm password is required"),
      name: z.string().min(1, "Display name is required"),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: "Passwords do not match",
      path: ["confirm_password"],
    });

  const forgotPasswordSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
  });

  const formSchema = mode === "signin" ? signInSchema : mode === "signup" ? signUpSchema : forgotPasswordSchema;

  useEffect(() => {
    const error = searchParams.get("error");

    if (error) {
      setError(GENERIC_ERROR);
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [searchParams]);

  const emailPasswordForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSetMode = (mode: "signin" | "signup" | "forgot_password") => {
    setMode(mode);
    setError(undefined);
    setForgotPasswordSent(false);
    emailPasswordForm.clearErrors();
    emailPasswordForm.reset();
  };

  const onEmailPasswordSubmit = async (formValues) => {
    setEmailPasswordLoading(true);

    if (mode === "signup") {
      const values: z.infer<typeof signUpSchema> = formValues;
      await emailPasswordSignUp(values.email, values.password, values.name);
    } else if (mode === "signin") {
      const values: z.infer<typeof signInSchema> = formValues;
      await emailPasswordSignIn(values.email, values.password);
    } else {
      const values: z.infer<typeof forgotPasswordSchema> = formValues;
      await sendForgotPasswordEmail(values.email);
    }

    setEmailPasswordLoading(false);
  };

  const handleThirdPartySignIn = async (providerId: "google") => {
    setError(null);
    setThirdPartyLoading(true);

    try {
      const url =
        await ThirdPartyEmailPassword.getAuthorisationURLWithQueryParamsAndSetState(
          {
            providerId,
            authorisationURL: `${window.location.origin}/login/callback/${providerId}`,
          }
        );

      window.location.href = url;
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
      setError("Invalid email or password. Please try again.");
      return;
    }
    if (response.status === "FIELD_ERROR") {
      response.formFields.forEach((item) => {
        if (item.id === "email") {
          setError(item.error);
        } else if (item.id === "password") {
          setError(item.error);
        }
      });

      return;
    }

    trackEvent("user_login", { method: "email_password" });
    window.location.assign("/");
  };

  const emailPasswordSignUp = async (
    email: string,
    password: string,
    name: string
  ) => {
    const response = await ThirdPartyEmailPassword.emailPasswordSignUp({
      formFields: [
        {
          id: "email",
          value: email,
        },
        {
          id: "password",
          value: password,
        },
        {
          id: "name",
          value: name,
        },
      ],
    });

    if (response.status === "FIELD_ERROR") {
      let error = "";
      response.formFields.forEach((item) => {
        error += item.error + "\n";
      });

      setError(error);
      return;
    }

    trackEvent("user_signup", { method: "email_password" });
    window.location.assign("/");
  };

  const sendForgotPasswordEmail = async (email: string) => {
    try {
      await ThirdPartyEmailPassword.sendPasswordResetEmail({
        formFields: [{ id: "email", value: email }],
      });
      setForgotPasswordSent(true);
    } catch (e) {
      setError(GENERIC_ERROR);
    }
  };

  return (
    <div className="dark h-full font-sans">
      <main className="app flex h-full min-h-full flex-1 overflow-hidden bg-neutral-900 text-slate-300">
        <div className="flex min-h-full flex-1 overflow-hidden">
          <div className="z-10 mx-auto flex min-w-[400px] flex-col justify-center bg-neutral-900 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
            <div className="mx-auto w-full max-w-sm lg:w-96">
              <div className="text-center">
                <img
                  className="inline-block h-20 w-auto"
                  src="https://cdn.pezzo.ai/logo-square-transparent-bg.png"
                  alt="Your Company"
                />
                <h2 className="mt-8 font-heading text-3xl leading-9 tracking-tight">
                  {mode === "forgot_password" ? "Forgot Password" : `${verb} to Pezzo`}{" "}
                </h2>
                {mode === "forgot_password" && !forgotPasswordSent && (
                  <p className="mt-2 text-sm text-neutral-400">
                    Enter your email and we'll send you a link to reset your password.
                  </p>
                )}
              </div>

              <div className="mb-4 mt-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertTitle>Oops!</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {forgotPasswordSent && (
                  <Alert>
                    <AlertTitle>Email sent!</AlertTitle>
                    <AlertDescription>
                      Check your email for a password reset link.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="mt-2 flex flex-col space-y-2">
                {googleEnabled && mode !== "forgot_password" && (
                  <Button
                    size="lg"
                    className="w-full bg-neutral-200 text-neutral-800 hover:bg-neutral-200 hover:text-neutral-700"
                    onClick={() => handleThirdPartySignIn("google")}
                    loading={thirdPartyLoading}
                  >
                    <img
                      src={GoogleIcon}
                      alt="Google Logo"
                      className="mr-3 h-5"
                    />
                    {verb} with Google
                  </Button>
                )}

                <motion.div
                  key={[mode, isEmail].join("_")}
                  initial={{ height: 10, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {(isEmail || mode === "forgot_password") && !forgotPasswordSent && (
                    <>
                      {googleEnabled && mode !== "forgot_password" && (
                        <div className="-mt-2 py-4">
                          <div className="h-px w-full bg-neutral-700"></div>
                        </div>
                      )}

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
                          {mode !== "forgot_password" && (
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
                          )}

                          {mode === "signup" && (
                            <>
                              <FormField
                                control={emailPasswordForm.control}
                                name="confirm_password"
                                render={({ field }) => (
                                  <FormItem>
                                    <Input
                                      {...field}
                                      autoComplete="off"
                                      size="lg"
                                      type="password"
                                      placeholder="Confirm Password"
                                      className="w-full"
                                    />
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={emailPasswordForm.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <Input
                                      {...field}
                                      size="lg"
                                      type="text"
                                      placeholder="Display Name (e.g. John Doe)"
                                      className="w-full"
                                    />
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </>
                          )}

                          <Button
                            type="submit"
                            size="lg"
                            variant="outline"
                            className="mb-2 w-full"
                            loading={emailPasswordLoading}
                          >
                            {mode === "forgot_password" ? "Send Reset Email" : `${verb} with Email`}
                          </Button>
                        </form>
                      </Form>
                    </>
                  )}
                </motion.div>

                {(!isEmail && mode !== "forgot_password") && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="mb-2 w-full"
                    loading={emailPasswordLoading}
                    onClick={() => setIsEmail(true)}
                  >
                    {verb} with Email
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
                {mode === "forgot_password" ? (
                  <p className="mt-2 text-center text-sm leading-6">
                    <Button
                      variant="link"
                      onClick={() => handleSetMode("signin")}
                      className="px-0 text-neutral-400"
                    >
                      ← Back to Sign in
                    </Button>
                  </p>
                ) : mode === "signin" ? (
                  <div className="flex flex-col items-center">
                    <p className="mt-2 text-center text-sm leading-6">
                      Don't have an account?{" "}
                      <Button
                        variant="link"
                        onClick={() => handleSetMode("signup")}
                        className="px-0"
                      >
                        Sign up
                      </Button>
                      .
                    </p>
                    <Button
                      variant="link"
                      onClick={() => handleSetMode("forgot_password")}
                      className="mt-1 px-0 text-xs text-neutral-500"
                    >
                      Forgot password?
                    </Button>
                  </div>
                ) : (
                  <p className="mt-2 text-center text-sm leading-6">
                    Already have an account?{" "}
                    <Button
                      variant="link"
                      onClick={() => {
                        handleSetMode("signin");
                      }}
                      className="px-0"
                    >
                      Sign in
                    </Button>
                    .
                  </p>
                )}
              </motion.div>
            </div>
          </div>
          <div className="relative hidden flex-1 bg-neutral-950 lg:flex">
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
      </main>
    </div>
  );
};
