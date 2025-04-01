import { redirect } from "next/navigation";

import { verifyEmail } from "@/features/auth/api/verify-email";
import { runParallelAction } from "@/shared/utils/parallel-server-action";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const VerifyEmailPage = async (props: { searchParams: SearchParams }) => {
  const searchParams = await props.searchParams;
  const token = searchParams.token;

  if (!token) {
    redirect("/sign-in");
  }

  await runParallelAction(verifyEmail(typeof token === "string" ? token : ""));

  redirect("/sign-in");
};

export default VerifyEmailPage;
