import styles from "@/styles/grid.module.scss"

interface Props {
  layouts: DisplayLayout[]
}

function createGrid(jsonData: DisplayLayout[]) {
  // Sort the data by y-coordinate in ascending order
  jsonData.sort((a, b) => a.mainLayout.y - b.mainLayout.y)

  // Initialize the grid as an empty array
  let grid = []

  // Loop through the data and add each item to the grid
  for (let i = 0; i < jsonData.length; i++) {
    let item = jsonData[i]

    // Find the row that this item belongs to, or create a new row if necessary
    let row: any = grid.find((row) => row[0].mainLayout.y === item.mainLayout.y)
    if (!row) {
      row = []
      grid.push(row)
    }

    // Add the item to the row and sort the row by x-coordinate in ascending order
    row.push(item)
    row.sort((a: any, b: any) => a.mainLayout.x - b.mainLayout.x)
  }

  return grid
}

function GridComponent({ layouts }: Props) {
  const grid = createGrid(layouts)

  return (
    <div className={styles.base}>
      {grid.map((row, i) => (
        <div
          key={i}
          className={styles.row}
          style={{
            gridTemplateColumns:
              row.length > 1
                ? row
                    .map((item: DisplayLayout) => `${item.mainLayout.w}fr`)
                    .join(" ")
                : "1fr",
          }}
        >
          {row.map((item: DisplayLayout) => (
            <div key={item.id} className={styles.item}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://f003.backblazeb2.com/file/caiden-thelonelylands/${item.image}`}
                alt="grid-item"
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default GridComponent
