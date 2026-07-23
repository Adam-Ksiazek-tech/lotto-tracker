import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SetupView } from "@/components/SetupView";

export const metadata = {
  title: "Ustawienia | Lotto Tracker",
};

export default async function SetupPage() {
  const session = await auth();

  console.log({
    a11: "*****",
    session,
  });
  
  if (!session) {
    redirect("/login");
  }

  return <SetupView />;
}