import { auth } from "@/auth";
import { HomeView } from "@/components/HomeView";

export default async function Page() {
  const session = await auth();
  return <HomeView isLoggedIn={!!session} />;
}