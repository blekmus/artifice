import styles from "@/styles/botched_editing.module.scss"
import EditingGridComponent from "@/components/editing_grid.component"

import { useAtom } from "jotai"
import { botchedContent } from "@/store"


function BotchedEditingComponent() {
  const [layouts, setLayouts] = useAtom(botchedContent)

  return (
    <div className={styles.base}>
      <EditingGridComponent layouts={layouts} setLayouts={setLayouts} />
    </div>
  )
}

export default BotchedEditingComponent
