
import BlogListPage from "./component/blog";
import HeroSection from "./component/hore";
import Navbar from "./component/Navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions)
  return (
    <>
      <div className="flex justify-center mx-auto flex-col w-full max-w-6xl">
        <Navbar session={session}/>
        <HeroSection />
        <BlogListPage />
      </div>
    </>
  );
}
