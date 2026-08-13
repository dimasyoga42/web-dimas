import { getSession } from "next-auth/react";
import BlogListPage from "../component/blog";
import Navbar from "../component/Navbar";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

const Blog = async () => {
  const session = await getServerSession(authOptions)

  return (
    <div className=" flex flex-col mx-auto max-w-6xl">
      <Navbar session={session } />
      <BlogListPage />
    </div>
  );
};

export default Blog;
