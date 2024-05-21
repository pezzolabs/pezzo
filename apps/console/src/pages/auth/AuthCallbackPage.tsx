import {useEffect, useState} from "react";
import { trackEvent } from "~/lib/utils/analytics";
import {useNavigate, useParams} from "react-router-dom";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Form,
  FormField,
  FormItem,
  FormMessage,
  Input
} from "@pezzo/ui";
import {motion} from "framer-motion";
import clsx from "clsx";
import Spline from "@splinetool/react-spline";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSignupUserMutation} from "~/graphql/hooks/mutations";
import BlurryBlurb from "~/assets/blurry-blurb.svg";

export const AuthCallbackPage = () => {
  const params = useParams();
  const [error, setError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);
  const [emailPasswordLoading, setEmailPasswordLoading] =
    useState<boolean>(false);
  const mode = "signup";
  const [isEmail, setIsEmail] = useState(false);
  const email = params.email;
  const name = email?.split("@")[0];
  const {mutateAsync: signupUser, isLoading} = useSignupUserMutation();
  const navigate = useNavigate();

  const formSchema = z
    .object({
      email: z.string().email({ message: "Invalid email address" }),
      name: z.string().min(1, "Display name is required"),
    });

  useEffect(() => {
    if (!email) {
      setError("No email provided");
    }
  }, [email]);

  const emailPasswordForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email,
      name: name,
    },
  });

  const OnEmailPasswordSubmit = async (formValues) => {
    setEmailPasswordLoading(true);
    trackEvent("user_signup", { method: "email_password" });
    const values: z.infer<typeof formSchema> = formValues;
    try {
      const user = await signupUser({ email: values.email, name: values.name });
      if (user.signupUser.email && isLoading === false) {
        setRegisterSuccess("You have successfully registered your account!");
        setEmailPasswordLoading(false);
        setTimeout(() => {
          navigate(`/orgs/${user.signupUser.orgMemberships[0].organizationId}`);
        }, 1500);
      }
    } catch (e) {
      setError(e.message);
      setEmailPasswordLoading(false);
    }
  };

  return (
    <div className="dark h-full font-sans">
      <main className="app flex h-full min-h-full flex-1 overflow-hidden bg-neutral-900 text-slate-300">
        <div className="flex min-h-full flex-1 overflow-hidden">
          <div
            className="z-10 mx-auto flex min-w-[400px] flex-col justify-center bg-neutral-900 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
            <div className="mx-auto w-full max-w-sm lg:w-96">
              <div className="text-center">
                <img
                  className="inline-block h-20 w-auto"
                  src="https://cdn.pezzo.ai/logo-square-transparent-bg.png"
                  alt="Your Company"
                />
                <h2 className="mt-8 font-heading text-3xl leading-9 tracking-tight">
                  Register your account to LLM Ops{" "}
                </h2>
              </div>

              <div className="mb-4 mt-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertTitle>Oops!</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {registerSuccess && (
                  <Alert variant="default">
                    <AlertTitle>Success!</AlertTitle>
                    <AlertDescription>{registerSuccess}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="mt-2 flex flex-col space-y-2">

                <motion.div
                  key={[mode, isEmail].join("_")}
                  initial={{height: 10, opacity: 0}}
                  animate={{height: "auto", opacity: 1}}
                  exit={{height: 0, opacity: 0}}
                  transition={{duration: 0.3}}
                >
                  <div className="-mt-2 py-4">
                    <div
                      className={`h-px w-full bg-neutral-700 ${clsx({
                        hidden: true,
                      })}`}
                    ></div>
                  </div>
                  <Form {...emailPasswordForm}>
                    <form
                      onSubmit={emailPasswordForm.handleSubmit(
                        OnEmailPasswordSubmit
                      )}
                      className="flex flex-col space-y-3"
                    >
                      <FormField
                        control={emailPasswordForm.control}
                        name="email"
                        render={({field}) => (
                          <FormItem>
                            <Input
                              value={email}
                              {...field}
                              size="lg"
                              type="email"
                              placeholder="Email"
                              className="w-full"
                            />
                            <FormMessage/>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={emailPasswordForm.control}
                        name="name"
                        render={({field}) => (
                          <FormItem>
                            <Input
                              {...field}
                              size="lg"
                              type="text"
                              placeholder="Display Name (e.g. John Doe)"
                              className="w-full"
                            />
                            <FormMessage/>
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
                        Register with Email
                      </Button>
                    </form>
                  </Form>
                </motion.div>
              </div>

              <motion.div
                key={mode}
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.3}}
              >
                <p className="mt-2 text-center text-sm leading-6">
                  Please register after first-time login, because your account still not exist in LLM Ops.
                </p>
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
                <Spline scene="https://prod.spline.design/qwBMirz3eudaCbeJ/scene.splinecode"/>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
