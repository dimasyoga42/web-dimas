import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Navbar from "@/app/component/Navbar"
import StremPage from "@/app/component/strem"
import { getServerSession } from "next-auth"

const Animestrem = async () => {
  const ses = await getServerSession(authOptions)
  return (
    <div className=" flex flex-col mx-auto max-w-6xl">
      <Navbar session={ses} />
      <StremPage />
    </div>
  )
}

export default Animestrem;
