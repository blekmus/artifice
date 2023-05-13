interface DisplayLayout {
    id: string
    createdAt: string
    updatedAt: string
    image: string
    mainLayout: MainLayout
    subLayout: SubLayout
}

interface MainLayout {
    id: string
    createdAt: string
    updatedAt: string
    w: number
    h: number
    x: number
    y: number
    layoutId: string
}

interface SubLayout {
    id: string
    createdAt: string
    updatedAt: string
    w: number
    h: number
    x: number
    y: number
    layoutId: string
}
