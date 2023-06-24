import { Responsive, WidthProvider } from "react-grid-layout"
import { v4 as uuid } from "uuid"
import { useCallback, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import Image, { ImageLoader } from "next/image"

import { BsImageFill } from "react-icons/bs"
import { CgCloseR } from "react-icons/cg"

import styles from "@/styles/editing_grid.module.scss"
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"

import { Layout } from "@/types/content"

const ResponsiveGrid = WidthProvider(Responsive)

function encodeURIAll(value: string) {
  return value.replace(
    /[^A-Za-z0-9]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`
  )
}

function EditingGridComponent({
  layouts,
  setLayouts,
}: {
  layouts: Layout[]
  setLayouts: React.Dispatch<React.SetStateAction<Layout[]>>
}) {
  const [currentLayout, setCurrentLayout] = useState<ReactGridLayout.Layout[]>(
    layouts.map((layout) => layout.mainLayout)
  )

  const [lastBreakpoint, setLastBreakpoint] = useState<string>()

  const onDropAccepted = useCallback(
    (acceptedFiles: Array<File>) => {
      // display image file in the grid
      const image = acceptedFiles[0]
      const reader = new FileReader()
      reader.readAsDataURL(image)
      reader.onload = () => {
        const base64 = reader.result
        const imageElement = document.createElement("img")
        imageElement.src = base64 as string
        imageElement.onload = () => {
          let width = imageElement.width
          let height = imageElement.height

          if (width / 100 > 20) {
            width = 20
          } else {
            width = Math.ceil(width / 50)
          }

          if (height / 100 > 10) {
            height = 10
          } else {
            height = Math.ceil(height / 50)
          }

          const newLayout = {
            w: width,
            h: height,
            x: layouts.length + 1,
            y: 0,
            i: uuid(),
          }

          setCurrentLayout([...currentLayout, newLayout])

          setLayouts([
            ...layouts,
            {
              id: newLayout.i,
              mainLayout: newLayout,
              subLayout: {
                w: layouts.length + 1,
                h: 5,
                x: 0,
                y: 0,
                i: newLayout.i,
              },
              image: URL.createObjectURL(acceptedFiles[0]),
            },
          ])
        }
      }
    },
    [currentLayout, layouts, setLayouts]
  )

  const { getRootProps, getInputProps, isFocused, isDragActive, isDragReject } =
    useDropzone({
      onDropAccepted,
      accept: {
        "image/png": [".png"],
        "image/jpeg": [".jpeg", ".jpg"],
        "image/webp": [".webp"],
      },
    })

  const [deleteHistory, setDeleteHistory] = useState<Layout[]>([])

  const handleDelete = (id: string) => {
    let newDeleteLayout = layouts.filter((layout) => layout.id === id)
    newDeleteLayout = newDeleteLayout.map((layout) => ({
      ...layout,
      mainLayout: currentLayout.filter((item) => item.i === layout.id)[0],
    }))

    setDeleteHistory(deleteHistory.concat(newDeleteLayout))
    setLayouts(layouts.filter((layout) => layout.id !== id))
    setCurrentLayout(currentLayout.filter((item) => item.i !== id))
  }

  // when ctrl + z is pressed the last deleted item should be added back to the grid
  useEffect(() => {
    const handleUndo = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.code === "KeyZ") {
        if (deleteHistory.length === 0) return

        const lastDeleted = deleteHistory[deleteHistory.length - 1]

        setDeleteHistory(deleteHistory.slice(0, deleteHistory.length - 1))
        setLayouts([...layouts, lastDeleted])
        setCurrentLayout([...currentLayout, lastDeleted.mainLayout])
      }
    }
    document.addEventListener("keydown", handleUndo)
    return () => {
      document.removeEventListener("keydown", handleUndo)
    }
  }, [currentLayout, deleteHistory, layouts, setLayouts])

  const imageLoader: ImageLoader = ({ src, width, quality }) => {
    if (src.startsWith("blob")) return src

    return `https://artifice.b-cdn.net/${encodeURIAll(src)}?w=${width}&q=${
      quality || 75
    }`
  }

  return (
    <div className={styles.base}>
      <ResponsiveGrid
        layouts={{
          lg: currentLayout,
          xs: currentLayout,
          xxs: currentLayout,
        }}
        breakpoints={{ lg: 1200, xs: 480, xxs: 0 }}
        cols={{ lg: 20, xs: 20, xxs: 1 }}
        rowHeight={30}
        isDraggable={true}
        isResizable={true}
        isBounded={true}
        onBreakpointChange={(e) => {
          if (e === lastBreakpoint) return

          // when the breakpoint changes from desktop to mobile
          if (lastBreakpoint !== "xxs" && e === "xxs") {
            setLayouts(
              layouts.map((layout) => ({
                ...layout,
                mainLayout: currentLayout.filter(
                  (item) => item.i === layout.id
                )[0],
              }))
            )

            const newSubLayout = layouts.map((layout) => layout.subLayout)
            setCurrentLayout(newSubLayout)
          }

          // when the breakpoint changes from mobile to desktop
          if (lastBreakpoint === "xxs" && e !== "xxs") {
            // update sub layout with the current (old) layout
            setLayouts(
              layouts.map((layout) => ({
                ...layout,
                subLayout: currentLayout.filter(
                  (item) => item.i === layout.id
                )[0],
              }))
            )

            setCurrentLayout(layouts.map((layout) => layout.mainLayout))
          }

          setLastBreakpoint(e)
        }}
        onLayoutChange={(e) => {
          const width = window.innerWidth
          // setting this to the breakpoint (480) doesn't work for some reason
          if (width > 500) {
            setLayouts(
              layouts.map((layout) => ({
                ...layout,
                mainLayout: e.filter((item) => item.i === layout.id)[0],
              }))
            )
          } else {
            setLayouts(
              layouts.map((layout) => ({
                ...layout,
                subLayout: e.filter((item) => item.i === layout.id)[0],
              }))
            )
          }

          setCurrentLayout(e)
        }}
      >
        {layouts.map((layout) => {
          console.log(layout.image)
          return (
            <div key={layout.id} className={styles.grid_item}>
              <div className={styles.grid_item_content}>
                <CgCloseR
                  className={styles.grid_item_close}
                  size="1.2em"
                  color="rgb(255, 0, 0)"
                  onClick={() => handleDelete(layout.id)}
                />
                <Image
                  src={layout.image}
                  alt="grid-item"
                  fill
                  loader={imageLoader}
                />
              </div>
            </div>
          )
        })}
      </ResponsiveGrid>

      <div className={styles.dropzone_cont}>
        <div
          {...getRootProps()}
          className={`
            ${styles.dropzone}
            ${isFocused && styles.dropzone_focused}
            ${isDragActive && styles.dropzone_focused}
            ${isDragReject && styles.dropzone_rejected}
          `}
        >
          <input {...getInputProps()} />
          <BsImageFill size="1.5em" />
        </div>
      </div>
    </div>
  )
}

export default EditingGridComponent
