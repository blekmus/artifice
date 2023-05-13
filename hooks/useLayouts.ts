import { useQuery } from '@tanstack/react-query'

const fetchLayouts = async () => {
    const resp = await fetch('/api/layouts')
    const data = await resp.json()
    return data
}

const useLayouts = () => {
    return useQuery({
        queryKey: ['layouts'],
        queryFn: () => fetchLayouts(),
    })
}

export default useLayouts
