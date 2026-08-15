import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import AnimeDetailPage from "@/app/component/detail"
import Navbar from "@/app/component/Navbar"
import { getServerSession } from "next-auth"

const Detailnime = async () => {
  const ses = await getServerSession(authOptions)
  return (
    <div className=" flex flex-col mx-auto max-w-6xl">
      <Navbar session={ses} />
      <AnimeDetailPage />
    </div>
  )
}
