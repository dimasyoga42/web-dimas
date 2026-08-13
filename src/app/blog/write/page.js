import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import WriteBlog from "@/app/component/write";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const WriteBlogPage = async () => {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")
  return (
    <>
      <WriteBlog />
    </>
  );
};

export default WriteBlogPage;
