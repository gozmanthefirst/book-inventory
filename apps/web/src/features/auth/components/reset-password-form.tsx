"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useForm, useStore } from "@tanstack/react-form";
import { AnimatePresence, motion } from "motion/react";
import { useQueryState } from "nuqs";
import { TbEye, TbEyeOff, TbLockPassword } from "react-icons/tb";
import { RotatingLines } from "react-loader-spinner";
import { toast } from "sonner";
import { z } from "zod";



import { Button } from "@/shared/components/button";
import { Input } from "@/shared/components/input";
import { InputIcon } from "@/shared/components/input-icon";
import { cn } from "@/shared/utils/cn";
import { alegreya } from "@/styles/fonts";
import { resetPassword } from "../api/reset-password";


const resetPwdSchema = z
  .object({
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

const buttonCopy = {
  idle: "Reset password",
  loading: <RotatingLines visible width="18" strokeColor="#faf2e8" />,
  success: "Password reset successful!",
  error: "Something went wrong",
};

export const ResetPasswordForm = () => {
  const [token] = useQueryState("token");

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [buttonState, setButtonState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const variants = {
    initial: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 40 },
  };

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    validators: {
      onChange: resetPwdSchema,
    },
    onSubmit: async ({ value }) => {
      if (!token) {
        redirect("/sign-in");
      }

      try {
        setButtonState("loading");

        const resetPwdResponse = await resetPassword({
          token,
          password: value.password,
          confirmPassword: value.confirmPassword,
        });

        if (resetPwdResponse.status === "error") {
          toast.error(resetPwdResponse.details);
          setButtonState("error");
        }

        if (resetPwdResponse.status === "success") {
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

  useEffect(() => {
    if (!token) {
      redirect("/sign-in");
    }
  }, [token]);

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1
          className={cn(
            "text-brand-500 text-3xl font-semibold",
            alegreya.className,
          )}
        >
          Reset password
        </h1>
        <p className="text-sm text-neutral-700">
          Remembered your password?{" "}
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
        id="reset-pwd-form"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <>
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
                  errors={formErrors.onChange ? field.state.meta.errors : []}
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
          form="reset-pwd-form"
          size={"lg"}
          variant={buttonState === "error" ? "destructive" : "brand"}
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
              {buttonCopy[buttonState]}
            </motion.div>
          </AnimatePresence>
        </Button>
      </div>
    </div>
  );
};