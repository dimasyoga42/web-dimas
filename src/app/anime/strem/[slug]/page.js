import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Navbar from "@/app/component/Navbar"
import StremPage from "@/app/component/strem"
import { getServerSession } from "next-auth"

const Animestrem = async () => {
  const ses = await getServerSession(authOptions)
  return (
    <>
      <Navbar session={ses} />
      <StremPage />
    </>
  )
}

export default Animestrem;
