import ContentComponent from "@/components/home.content.component"
import HeaderComponent from "@/components/home.header.component"
import MenuComponent from "@/components/home.menu.component"
import Head from "next/head"

export default function Home() {
  return (
    <>
      <Head>
        <title>Artifice</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <HeaderComponent />
        <MenuComponent />
        <ContentComponent />
      </main>
    </>
  )
}