import { redirect } from "next/navigation";

import { getUser } from "@/features/auth/api/get-user";
import { getMyBooks } from "@/shared/api/get-my-books";
import { runParallelAction } from "@/shared/utils/parallel-server-action";

const HomePage = async () => {
  const [{ data: user }, { data: myBooks }] = await Promise.all([
    runParallelAction(getUser()),
    runParallelAction(getMyBooks()),
  ]);

  if (!user) {
    redirect("/sign-in");
  } else {
    if (myBooks?.length) {
      redirect("/my-books");
    } else {
      redirect("/search");
    }
  }
};

export default HomePage;
