import GridComponent from "@/components/grid.component"
import useLayouts from "@/hooks/useLayouts"

const HomeGridComponent = () => {
  const { data, isLoading } = useLayouts()
  if (isLoading) return <div>Loading...</div>

  return (
    <GridComponent layouts={data} />
  )
}

export default HomeGridComponent
