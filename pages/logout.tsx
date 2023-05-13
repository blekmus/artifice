import { useSession } from "next-auth/react"
import { useRouter } from "next/router"

export default function Login() {
  const router = useRouter()

  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/")
    },
  })

  if (status === "authenticated") {
    router.push("/api/auth/signout")
    return null
  }

  return <p>Loading</p>
}
