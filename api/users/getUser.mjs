import { cotalkerAPI } from "../APIClient.mjs"

export const getUser = async (userId, silent) => {
    const result = await cotalkerAPI.get(`/api/v2/users/${userId}`, silent)
    if (result.status < 300) return result.data.data
    return null
}

export const getUserByEmail = async (email, silent) => {
    const result = await cotalkerAPI.get(`/api/v2/users?email=${email}`, silent)
    if (result.status < 300) return result.data.data.users[0]
    return null    
}
