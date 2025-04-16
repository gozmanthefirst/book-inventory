"use client";

import { useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useForm, useStore } from "@tanstack/react-form";
import { AnimatePresence, motion } from "motion/react";
import { TbAt, TbEye, TbEyeOff, TbLockPassword } from "react-icons/tb";
import { RotatingLines } from "react-loader-spinner";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/shared/components/button";
import { Input } from "@/shared/components/input";
import { InputIcon } from "@/shared/components/input-icon";
import { cn } from "@/shared/utils/cn";
import { alegreya } from "@/styles/fonts";
import { loginUser } from "../api/login";

const signInSchema = z.object({
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
});

const emailButtonCopy = {
  idle: "Sign in",
  loading: <RotatingLines visible width="18" strokeColor="#faf2e8" />,
  success: "Sign in successful!",
  error: "Something went wrong",
  verifyEmail: "Verify your email",
  invalidCredentials: "Invalid email or password",
};

export const SignInForm = () => {
  const [showPwd, setShowPwd] = useState(false);
  const [buttonState, setButtonState] = useState<
    | "idle"
    | "loading"
    | "success"
    | "error"
    | "verifyEmail"
    | "invalidCredentials"
  >("idle");

  const variants = {
    initial: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 40 },
  };

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: signInSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        setButtonState("loading");

        const signInResponse = await loginUser({
          email: value.email,
          password: value.password,
        });

        if (signInResponse.status === "error") {
          toast.error(signInResponse.details);
          setButtonState(
            signInResponse.errorCode === "INVALID_CREDENTIALS"
              ? "invalidCredentials"
              : signInResponse.errorCode === "EMAIL_NOT_VERIFIED"
                ? "verifyEmail"
                : "error",
          );
          return;
        }

        if (signInResponse.status === "success") {
          setButtonState("success");
          setTimeout(() => {
            redirect("/search");
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
            "text-brand-500 text-3xl font-semibold",
            alegreya.className,
          )}
        >
          Sign in
        </h1>
        <p className="text-sm text-neutral-700">
          {`Don't have an account?`}{" "}
          <Link
            prefetch
            href={"/sign-up"}
            className="text-brand-500 lg:hover:underline lg:hover:underline-offset-2"
          >
            Sign up
          </Link>
          .
        </p>
      </div>

      <form
        id="sign-in-form"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <>
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
        </>
      </form>

      {formErrors.onChange ? (
        <div className="-mt-4 flex items-center gap-1 text-xs text-red-600">
          {Object.values(formErrors.onChange)[0]?.[0]?.message}
        </div>
      ) : null}

      <div className="flex flex-col gap-3">
        <Button
          form="sign-in-form"
          size={"lg"}
          variant={
            buttonState === "error" ||
            buttonState === "verifyEmail" ||
            buttonState === "invalidCredentials"
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

        {/* Forgot Password */}
        <Link
          prefetch
          href={"/forgot-password"}
          className="text-brand-500 self-start text-xs lg:hover:underline lg:hover:underline-offset-2"
        >
          Forgot your password?
        </Link>
      </div>
    </div>
  );
};
