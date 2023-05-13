import { useQuery } from '@tanstack/react-query'

const fetchLayouts = async () => {
    const resp = await fetch('/api/botchedlayouts')
    const data = await resp.json()
    return data
}

const useBotchedLayouts = () => {
    return useQuery({
        queryKey: ['botchedlayouts'],
        queryFn: () => fetchLayouts(),
    })
}

export default useBotchedLayouts
