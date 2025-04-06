"use client";

import { useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useForm, useStore } from "@tanstack/react-form";
import { AnimatePresence, motion } from "motion/react";
import { TbAt, TbEye, TbEyeOff, TbLockPassword, TbUser } from "react-icons/tb";
import { RotatingLines } from "react-loader-spinner";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/shared/components/button";
import { Input } from "@/shared/components/input";
import { InputIcon } from "@/shared/components/input-icon";
import { cn } from "@/shared/utils/cn";
import { alegreya } from "@/styles/fonts";
import { registerUser } from "../api/register";

const signUpSchema = z
  .object({
    name: z
      .string({ required_error: "A name is required" })
      .trim()
      .min(3, { message: "The name must have at least 3 characters" })
      .max(128, { message: "The name can't have more than 128 characters" }),
    email: z
      .string({ required_error: "An email is required" })
      .trim()
      .email({ message: "The email is invalid" }),
    password: z
      .string({ required_error: "A password is required" })
      .trim()
      .min(8, { message: "The password must have at least 8 characters" })
      .max(32, { message: "The password can't have more than 32 characters" })
      .refine((data) => !/\s/.test(data), {
        message: "The password can't contain any whitespace",
      }),
    confirmPassword: z
      .string({ required_error: "The password must be confirmed" })
      .trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "The passwords do not match",
    path: ["confirmPassword"],
  });

const emailButtonCopy = {
  idle: "Sign up",
  loading: <RotatingLines visible width="18" strokeColor="#faf2e8" />,
  success: "Verification email sent!",
  error: "Something went wrong",
  userExists: "This email has been used",
};

export const SignUpForm = () => {
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [buttonState, setButtonState] = useState<
    "idle" | "loading" | "success" | "error" | "userExists"
  >("idle");

  const variants = {
    initial: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 40 },
  };

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onChange: signUpSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        setButtonState("loading");

        const signUpResponse = await registerUser({
          name: value.name,
          email: value.email,
          password: value.password,
          confirmPassword: value.confirmPassword,
        });

        if (signUpResponse.status === "error") {
          toast.error(signUpResponse.details);
          setButtonState(
            signUpResponse.errorCode === "USER_EXISTS" ? "userExists" : "error",
          );
          return;
        }

        if (signUpResponse.status === "success") {
          setButtonState("success");
          setTimeout(() => {
            redirect("/sign-in");
          }, 1000);
        }
      } catch (err) {
        console.error(`An unexpected error occurred: ${err}`);
        toast.error("An unexpected error occurred");
        setButtonState("error");
      } finally {
        if (buttonState !== "success") {
          setTimeout(() => {
            setButtonState("idle");
          }, 3000);
        }
      }
    },
  });

  const formErrors = useStore(form.store, (state) => state.errorMap);

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1
          className={cn(
            "text-3xl font-semibold text-brand-500",
            alegreya.className,
          )}
        >
          Sign up
        </h1>
        <p className="text-sm text-neutral-700">
          Already have an account?{" "}
          <Link
            prefetch
            href={"/sign-in"}
            className="text-brand-500 lg:hover:underline lg:hover:underline-offset-2"
          >
            Sign in
          </Link>
          .
        </p>
      </div>

      <form
        id="sign-up-form"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <>
          {/* Name */}
          <form.Field name="name">
            {(field) => (
              <div className="group relative">
                <InputIcon>
                  <TbUser size={18} />
                </InputIcon>
                <Input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  errors={field.state.meta.errors}
                  placeholder="name"
                  type="text"
                  className="pl-10"
                />
              </div>
            )}
          </form.Field>

          {/* Email */}
          <form.Field name="email">
            {(field) => (
              <div className="group relative">
                <InputIcon>
                  <TbAt size={18} />
                </InputIcon>
                <Input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  errors={field.state.meta.errors}
                  placeholder="email"
                  type="email"
                  className="pl-10"
                />
              </div>
            )}
          </form.Field>

          {/* Password */}
          <form.Field name="password">
            {(field) => (
              <div className="group relative">
                <InputIcon>
                  <TbLockPassword size={18} />
                </InputIcon>
                <Input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  errors={field.state.meta.errors}
                  placeholder="password"
                  type={showPwd ? "text" : "password"}
                  className="px-10"
                />
                <InputIcon
                  direction="end"
                  onClick={() => setShowPwd((state) => !state)}
                  className="cursor-pointer"
                >
                  {showPwd ? <TbEyeOff size={18} /> : <TbEye size={18} />}
                </InputIcon>
              </div>
            )}
          </form.Field>

          {/* Confirm password */}
          <form.Field name="confirmPassword">
            {(field) => (
              <div className="group relative">
                <InputIcon>
                  <TbLockPassword size={18} />
                </InputIcon>
                <Input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  errors={field.state.meta.errors}
                  placeholder="confirm password"
                  type={showConfirmPwd ? "text" : "password"}
                  className="px-10"
                />
                <InputIcon
                  direction="end"
                  onClick={() => setShowConfirmPwd((state) => !state)}
                  className="cursor-pointer"
                >
                  {showConfirmPwd ? (
                    <TbEyeOff size={18} />
                  ) : (
                    <TbEye size={18} />
                  )}
                </InputIcon>
              </div>
            )}
          </form.Field>
        </>
      </form>

      {formErrors.onChange ? (
        <div className="-mt-4 flex items-center gap-1 text-xs text-red-600">
          {Object.values(formErrors.onChange)[0]?.[0]?.message}
        </div>
      ) : null}

      <div>
        <Button
          form="sign-up-form"
          size={"lg"}
          variant={
            buttonState === "error" || buttonState === "userExists"
              ? "destructive"
              : "brand"
          }
          disabled={buttonState !== "idle"}
          className="relative w-full gap-2 overflow-hidden"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={buttonState}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              initial="initial"
              animate="visible"
              exit="exit"
              variants={variants}
            >
              {emailButtonCopy[buttonState]}
            </motion.div>
          </AnimatePresence>
        </Button>
      </div>

      {/* <div className="relative flex items-center justify-center">
        <div className="my-2 h-px w-full bg-neutral-300" />
        <div className="absolute top-0.5 bg-background px-2 text-xs font-bold text-neutral-400">
          OR
        </div>
      </div>

      <GoogleButton /> */}
    </div>
  );
};

// const googleButtonCopy = {
//   idle: (
//     <div className="flex items-center gap-2">
//       <TbBrandGoogleFilled size={18} />
//       <span className="mt-0.5">Continue with Google</span>
//     </div>
//   ),
//   loading: <RotatingLines visible width="18" strokeColor="#005cff" />,
//   success: "Signing up...",
//   error: "Something went wrong",
// };

// const GoogleButton = () => {
//   const [buttonState, setButtonState] = useState<
//     "idle" | "loading" | "success" | "error"
//   >("idle");

//   const variants = {
//     initial: { opacity: 0, y: -40 },
//     visible: { opacity: 1, y: 0 },
//     exit: { opacity: 0, y: 40 },
//   };

//   const handleGoogleSignIn = async () => {
//     try {
//       await authClient.signIn.social(
//         {
//           provider: "google",
//         },
//         {
//           onRequest() {
//             setButtonState("loading");
//           },
//           onError(ctx) {
//             if (process.env.NODE_ENV !== "production") {
//               console.error(ctx.error);
//             }

//             setButtonState("error");
//           },
//           onSuccess() {
//             setButtonState("success");
//           },
//         },
//       );
//     } catch (error) {
//       if (process.env.NODE_ENV !== "production") {
//         console.error(error);
//       }

//       setButtonState("error");
//     } finally {
//       setTimeout(() => {
//         setButtonState("idle");
//       }, 3000);
//     }
//   };

//   return (
//     <div>
//       <Button
//         size={"lg"}
//         variant={"secondary"}
//         disabled={buttonState !== "idle"}
//         onClick={handleGoogleSignIn}
//         className="relative w-full gap-2 overflow-hidden"
//       >
//         <AnimatePresence mode="popLayout" initial={false}>
//           <motion.div
//             key={buttonState}
//             transition={{ type: "spring", bounce: 0, duration: 0.3 }}
//             initial="initial"
//             animate="visible"
//             exit="exit"
//             variants={variants}
//           >
//             {googleButtonCopy[buttonState]}
//           </motion.div>
//         </AnimatePresence>
//       </Button>
//     </div>
//   );
// };
