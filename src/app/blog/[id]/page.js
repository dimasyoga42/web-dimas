import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Navbar from "@/app/component/Navbar";
import BlogDetailPage from "@/app/component/read";
import { getServerSession } from "next-auth";

const BlogDetail = async () => {
const session = await getServerSession(authOptions)
  return (
    <div className="mx-auto max-w-7xl w-full">
      <Navbar session={session } />
      <BlogDetailPage />
    </div>
  );
};

export default BlogDetail;
