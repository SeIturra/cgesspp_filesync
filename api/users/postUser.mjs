import { cotalkerAPI } from "../APIClient.mjs"

export const postUser = async (body, silent) => {
    const result = await cotalkerAPI.post('/api/v2/users', body, silent)
    if (result.status === 201) return result.data.data
    return null 
}
