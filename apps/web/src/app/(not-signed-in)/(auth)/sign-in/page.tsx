import { SignInForm } from "@/features/auth/components/sign-in-form";

const SignInPage = async () => {
  return (
    <main className="flex flex-1 flex-col items-center justify-center">
      <SignInForm />
    </main>
  );
};

export default SignInPage;
