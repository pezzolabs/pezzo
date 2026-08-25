import BlurryBlurb from "~/assets/blurry-blurb.svg";
import Spline from "@splinetool/react-spline";
import { useState } from "react";
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
import ThirdPartyEmailPassword from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import { Form, FormField } from "@pezzo/ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const GENERIC_ERROR = "Something went wrong. Please try again later.";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\-]).{8,}$/,
        "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special symbol"
      ),
    confirm_password: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordPage = () => {
  usePageTitle("Reset Password");

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "invalid_token"
  >("idle");
  const [error, setError] = useState<string | undefined>(undefined);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setStatus("loading");
    setError(undefined);

    try {
      const response = await ThirdPartyEmailPassword.submitNewPassword({
        formFields: [{ id: "password", value: values.password }],
      });

      if (response.status === "RESET_PASSWORD_INVALID_TOKEN_ERROR") {
        setStatus("invalid_token");
        return;
      }

      if (response.status === "FIELD_ERROR") {
        response.formFields.forEach((item) => {
          if (item.id === "password") {
            setError(item.error);
          }
        });
        setStatus("idle");
        return;
      }

      // status === "OK"
      setStatus("success");
    } catch {
      setError(GENERIC_ERROR);
      setStatus("idle");
    }
  };

  return (
    <div className="dark h-full font-sans">
      <main className="app flex h-full min-h-full flex-1 overflow-hidden bg-neutral-900 text-slate-300">
        <div className="flex min-h-full flex-1 overflow-hidden">
          {/* Left panel */}
          <div className="z-10 mx-auto flex min-w-[400px] flex-col justify-center bg-neutral-900 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
            <div className="mx-auto w-full max-w-sm lg:w-96">
              <div className="text-center">
                <img
                  className="inline-block h-20 w-auto"
                  src="https://cdn.pezzo.ai/logo-square-transparent-bg.png"
                  alt="Pezzo"
                />
                <h2 className="mt-8 font-heading text-3xl leading-9 tracking-tight">
                  {status === "success" ? "Password Updated!" : "Set New Password"}
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

              <motion.div
                key={status}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                {status === "success" && (
                  <div className="flex flex-col items-center space-y-4 rounded-lg border border-neutral-700 bg-neutral-800/50 p-6 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
                      <svg
                        className="h-6 w-6 text-emerald-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        Your password has been updated
                      </p>
                      <p className="mt-1 text-sm text-neutral-400">
                        You can now sign in with your new password.
                      </p>
                    </div>
                    <Link to="/login" className="w-full">
                      <Button className="w-full" size="lg">
                        Go to Sign In
                      </Button>
                    </Link>
                  </div>
                )}

                {status === "invalid_token" && (
                  <div className="flex flex-col items-center space-y-4 rounded-lg border border-red-800/50 bg-red-900/10 p-6 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
                      <svg
                        className="h-6 w-6 text-red-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        Link expired or invalid
                      </p>
                      <p className="mt-1 text-sm text-neutral-400">
                        This password reset link is no longer valid. Please
                        request a new one.
                      </p>
                    </div>
                    <Link to="/login" className="w-full">
                      <Button variant="outline" className="w-full" size="lg">
                        Request New Link
                      </Button>
                    </Link>
                  </div>
                )}

                {(status === "idle" || status === "loading") && (
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="flex flex-col space-y-3"
                    >
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <Input
                              {...field}
                              size="lg"
                              type="password"
                              placeholder="New Password"
                              className="w-full"
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="confirm_password"
                        render={({ field }) => (
                          <FormItem>
                            <Input
                              {...field}
                              size="lg"
                              type="password"
                              placeholder="Confirm New Password"
                              className="w-full"
                              autoComplete="off"
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        loading={status === "loading"}
                      >
                        Set New Password
                      </Button>
                    </form>
                  </Form>
                )}
              </motion.div>

              <p className="mt-6 text-center text-sm leading-6">
                <Link
                  to="/login"
                  className="text-xs text-neutral-500 transition-colors hover:text-neutral-200"
                >
                  ← Back to Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Right decorative panel */}
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
