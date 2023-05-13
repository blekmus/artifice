import BotchedContentComponent from "@/components/botched.content.component"
import BotchedHeaderComponent from "@/components/botched.header.component"
import Head from "next/head"

export default function Botched() {
  return (
    <>
      <Head>
        <title>Artifice</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <BotchedHeaderComponent />
        <BotchedContentComponent />
      </main>
    </>
  )
}
