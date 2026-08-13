import { getSession } from "next-auth/react";
import Dashboard from "../component/dashboard";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

const DashboardPage = async () => {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")
  return (
    <>
      <Dashboard />
    </>
  );
};

export default DashboardPage;
