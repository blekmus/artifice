import GridComponent from "@/components/grid.component"
import useBotchedLayouts from "@/hooks/useBotchedLayouts"

const BotchedGridComponent = () => {
  const { data, isLoading } = useBotchedLayouts()
  if (isLoading) return <div>Loading...</div>

  return (
    <GridComponent layouts={data} />
  )
}

export default BotchedGridComponent
