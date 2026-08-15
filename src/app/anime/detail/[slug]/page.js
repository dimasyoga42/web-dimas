import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import AnimeDetailPage from "@/app/component/detail"
import Navbar from "@/app/component/Navbar"
import { getServerSession } from "next-auth"

const Detailnime = async () => {
  const ses = await getServerSession(authOptions)
  return (
    <>
      <Navbar session={ses} />
      <AnimeDetailPage />
    </>
  )
}
