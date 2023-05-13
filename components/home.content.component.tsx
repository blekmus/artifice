import { useAtomValue } from "jotai"
import { homeContentEditing } from "@/store"

import styles from "@/styles/content.module.scss"
import HomeGridComponent from "@/components/home.grid.component"
import ContentEditingComponent from "@/components/home.editing.component"

function ContentComponent() {
  const editing = useAtomValue(homeContentEditing)

  return (
    <div className={styles.base}>
      {editing ? <ContentEditingComponent /> : <HomeGridComponent />}
    </div>
  )
}

export default ContentComponent
