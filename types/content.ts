export interface Layout {
    id: string
    mainLayout: ReactGridLayout.Layout | MainLayout
    subLayout: ReactGridLayout.Layout | SubLayout
    image: string
}

interface MainLayout {
    w: number
    h: number
    x: number
    y: number
    i: string
}

interface SubLayout {
    w: number
    h: number
    x: number
    y: number
    i: string
}
