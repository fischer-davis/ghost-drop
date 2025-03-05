"use client";

import { authClient } from "@web/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Home = () => {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (session) {
      router.push("/home");
    } else {
      router.push("/signin");
    }
  }, [session, router, isPending]);

  return null;
};

export default Home;
