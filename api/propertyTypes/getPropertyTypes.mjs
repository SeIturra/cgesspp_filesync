import { cotalkerAPI } from '../APIClient.mjs'
import { URLSearchParams } from 'node:url'

export const getByCode = async (code) => {
    const queryParams = new URLSearchParams({ code, limit: 1 })
    const path = `/api/v2/propertyTypes?${queryParams.toString()}`
    const response = await cotalkerAPI.get(path)
    return response.data?.propertyTypes[0]
}

export const getById = async (id) => {
    const path =  `/api/v2/propertyType/${id}`
    const response = await cotalkerAPI.get(path)
    return response.data
}
