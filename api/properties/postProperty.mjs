import { cotalkerAPI } from "../APIClient.mjs"

export const postProperty = async (body, silent) => {
    const result = await cotalkerAPI.post('/api/v2/properties', body)
    if (result.status === 201) return result.data.data
    return null 
}
