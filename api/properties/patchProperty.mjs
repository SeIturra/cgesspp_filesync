import { cotalkerAPI } from "../APIClient.mjs"

export const patchProperty = async (id, body, silent) => {
    const result = await cotalkerAPI.patch(`/api/v2/properties/${id}`, body)
    if (result.status === 201) return result.data.data
    return null 
}

export const jsonPatchProperty = async (id, body, silent) => {
    const result = await cotalkerAPI.patch(`/api/v2/properties/jsonpatch/${id}`, body, silent, false)
    if (result.status === 200) return result.data.data
    return null 
}
