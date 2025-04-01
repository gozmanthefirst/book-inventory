import { ReactNode } from "react";
import { redirect } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getUser } from "@/features/auth/api/get-user";
import { BottomNav } from "@/features/navigation/components/bottom-nav";
import { getMyBooks } from "@/shared/api/get-my-books";
import { Container } from "@/shared/components/container";
import { Header } from "@/shared/components/header";
import { runParallelAction } from "@/shared/utils/parallel-server-action";

interface Props {
  children: ReactNode;
}

const BooksLayout = async ({ children }: Props) => {
  const queryClient = new QueryClient();

  const [{ data: user }, { data: myBooks }] = await Promise.all([
    runParallelAction(getUser()),
    runParallelAction(getMyBooks()),
  ]);

  if (!user) {
    redirect("/sign-in");
  }

  queryClient.setQueryData(["my-books"], { data: myBooks });
  queryClient.setQueryData(["user"], { data: user });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container className="flex min-h-dvh flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <BottomNav />
      </Container>
    </HydrationBoundary>
  );
};

export default BooksLayout;
