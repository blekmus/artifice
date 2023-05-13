import styles from "@/styles/menu.module.scss"
import Rainbow from "@/assets/rainbow.png"
import Link from "next/link"
import { HiPlus, HiCheck, HiX } from "react-icons/hi"
import { homeContent, homeContentEditing } from "@/store"
import { useAtom } from "jotai"
import { useSession } from "next-auth/react"
import { useQueryClient } from "@tanstack/react-query"

import useLayouts from "@/hooks/useLayouts"
import { useMemo } from "react"

function MenuComponent() {
  const { status } = useSession()
  const queryClient = useQueryClient()

  const { data } = useLayouts()

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

  const [editing, setEditing] = useAtom(homeContentEditing)
  const [layouts, setLayouts] = useAtom(homeContent)

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

    const resp = await fetch("/api/layout/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newLayouts),
    })

    if (!resp.ok) throw new Error("Failed to update layout")

    queryClient.invalidateQueries({ queryKey: ["layouts"] })

    setEditing(!editing)
    setLayouts([])
  }

  return (
    <div className={styles.base}>
      <div className={styles.showcase}>
        <h3
          style={{
            backgroundImage: `url(${Rainbow.src})`,
          }}
        >
          Showcase
        </h3>
      </div>
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
      <div className={styles.botched}>
        <h3>
          <Link href="/botched" passHref={true}>
            Botched Corner{" "}
            <svg
              width="20"
              height="11"
              viewBox="0 0 20 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.9475 6.09483C19.2209 5.82146 19.2209 5.37825 18.9475 5.10488L14.4927 0.650107C14.2194 0.37674 13.7761 0.37674 13.5028 0.650107C13.2294 0.923474 13.2294 1.36669 13.5028 1.64006L17.4626 5.59985L13.5028 9.55965C13.2294 9.83302 13.2294 10.2762 13.5028 10.5496C13.7761 10.823 14.2193 10.823 14.4927 10.5496L18.9475 6.09483ZM0.75708 6.29985L18.4525 6.29986L18.4525 4.89986L0.75708 4.89985L0.75708 6.29985Z"
                fill="#A6A6A6"
              />
            </svg>
          </Link>
        </h3>
      </div>
    </div>
  )
}

export default MenuComponent
