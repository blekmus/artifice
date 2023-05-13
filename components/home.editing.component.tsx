import styles from "@/styles/content_editing.module.scss"

import EditingGridComponent from "@/components/editing_grid.component"
import { useAtom } from "jotai"
import { homeContent } from "@/store"

function ContentEditingComponent() {
  const [layouts, setLayouts] = useAtom(homeContent)

  return (
    <div className={styles.base}>
      <EditingGridComponent layouts={layouts} setLayouts={setLayouts} />
    </div>
  )
}

export default ContentEditingComponent
