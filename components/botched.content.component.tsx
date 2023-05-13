import { useAtomValue } from "jotai"
import { botchedContentEditing } from "@/store"

import styles from "@/styles/botched_content.module.scss"
import BotchedEditingComponent from "./botched.editing.component"
import BotchedGridComponent from "./botched.grid.component"

function BotchedContentComponent() {
  const editing = useAtomValue(botchedContentEditing)

  return (
    <div className={styles.base}>
      {editing ? <BotchedEditingComponent /> : <BotchedGridComponent />}
    </div>
  )
}

export default BotchedContentComponent
