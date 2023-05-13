import { atom } from "jotai"
import { Layout } from "@/types/content"


export const homeContentEditing = atom(false)
export const botchedContentEditing = atom(false)

export const botchedContent = atom<Layout[]>([])
export const homeContent = atom<Layout[]>([])

export const gridContent = atom([])