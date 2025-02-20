import { getServerAuthSession } from "@web/server/auth/config";
import { redirect } from "next/navigation";

const Home = async () => {
  const session = await getServerAuthSession();
  if (session) {
    redirect("/home");
  } else {
    redirect("/signin");
  }
};

export default Home;
