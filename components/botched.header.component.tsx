import Barcode from "@/assets/barcode.png"
import styles from "@/styles/botched_header.module.scss"
import Image from "next/image"
import Rainbow from "@/assets/rainbow.png"
import { useAtom } from "jotai"
import { useQueryClient } from "@tanstack/react-query"


import { botchedContentEditing } from "@/store"
import { HiPlus, HiCheck, HiX } from "react-icons/hi"
import { useSession } from "next-auth/react"
import useBotchedLayouts from "@/hooks/useBotchedLayouts"


import { botchedContent } from "@/store"
import { useMemo } from "react"
import Link from "next/link"

function BotchedHeaderComponent() {
  const queryClient = useQueryClient()

  const { data } = useBotchedLayouts()

  const dataFormat = useMemo(() => {
    if (!data) return []

    let initialLayouts = data as DisplayLayout[]

    return initialLayouts.map((layout) => ({
      id: layout.id,
      image: layout.image,
      mainLayout: {
        w: layout.mainLayout.w,
        h: layout.mainLayout.h,
        x: layout.mainLayout.x,
        y: layout.mainLayout.y,
        i: layout.id,
      },
      subLayout: {
        w: layout.subLayout.w,
        h: layout.subLayout.h,
        x: layout.subLayout.x,
        y: layout.subLayout.y,
        i: layout.id,
      },
    }))
  }, [data])


  const { status } = useSession()
  const [editing, setEditing] = useAtom(botchedContentEditing)
  const [layouts, setLayouts] = useAtom(botchedContent)

  const handleEditing = () => {
    setEditing(!editing)

    if (!editing) {
      setLayouts(dataFormat)
    } else {
      setLayouts([])
    }
  }

  const handleSave = async () => {
    const uploadedImages = await Promise.all(
      layouts.map(async (layout) => {
        if (!layout.image.startsWith("blob")) return

        const coverFile: File = (await fetch(layout.image).then((r) =>
          r.blob()
        )) as File

        const formData = new FormData()
        formData.append("file", coverFile)

        const resp = await fetch("/api/image/upload", {
          method: "POST",
          body: formData,
        })

        if (!resp.ok) throw new Error("Failed to upload image")

        const { url }: { url: string } = await resp.json()
        return { id: layout.id, url: url }
      })
    )

    // update layouts with new urls
    const newLayouts = layouts.map((layout) => {
      const uploadedImage = uploadedImages.find(
        (image) => image && image.id === layout.id
      )

      if (uploadedImage) {
        return {
          ...layout,
          image: uploadedImage.url,
        }
      } else {
        return layout
      }
    })

    const resp = await fetch("/api/layout/botchedupdate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newLayouts),
    })

    if (!resp.ok) throw new Error("Failed to update layout")

    queryClient.invalidateQueries({ queryKey: ["botchedlayouts"] })

    setEditing(!editing)
    setLayouts([])
  }

  return (
    <div className={styles.base}>
      <div className={styles.title}>
        <h1>
          <Link href="/">
            <i>ARTIFICE</i>
          </Link>
        </h1>
        <div className={styles.barcode_edit}>
          <Image src={Barcode} alt="barcode" priority />
          <div className={styles.edit}>
            {status === "authenticated" &&
              (!editing ? (
                <button onClick={handleEditing}>
                  <HiPlus size="2em" />
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    style={{ marginRight: "15px", color: "#a1f7d1" }}
                  >
                    <HiCheck size="2em" />
                  </button>
                  <button
                    onClick={handleEditing}
                    style={{ marginLeft: "15px", color: "#fca592" }}
                  >
                    <HiX size="2em" />
                  </button>
                </>
              ))}
          </div>
        </div>
      </div>

      <div className={styles.batched}>
        <h3
          style={{
            backgroundImage: `url(${Rainbow.src})`,
          }}
        >
          Botched Corner
        </h3>
      </div>
    </div>
  )
}

export default BotchedHeaderComponent
