import { Suspense } from "react";
import { redirect } from "next/navigation";

import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const ResetPasswordPage = async (props: { searchParams: SearchParams }) => {
  const searchParams = await props.searchParams;
  const token = searchParams.token;

  if (!token) {
    redirect("/sign-in");
  }

  return (
    <Suspense>
      <main className="flex flex-1 flex-col items-center justify-center">
        <ResetPasswordForm />
      </main>
    </Suspense>
  );
};

export default ResetPasswordPage;
