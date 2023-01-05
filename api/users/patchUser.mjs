import { cotalkerAPI } from "../APIClient.mjs"

export const patchUser = async (user_id, body, silent) => {
    const result = await cotalkerAPI.patch(`/api/v2/users/${user_id}`, body, silent)
    if (result.status < 300) return result.data.data
    return null
}

export const jsonPatchUser = async (user_id, body, silent) => {
    const result = await cotalkerAPI.patch(`/api/v2/users/jsonpatch/${user_id}`, body, silent)
    if (result.status < 300) return result.data.data
    return null
}
