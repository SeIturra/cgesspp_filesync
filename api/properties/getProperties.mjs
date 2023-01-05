import { cotalkerAPI } from '../APIClient.mjs'

export const getProperty = async (propertyId, silent) => {
    const result = await cotalkerAPI.get(`/api/v2/properties/${propertyId}`, silent)
    if (result.status < 300) return result.data.data
    return null
}

export const getPropertyByCode = async (propertyCode, silent) => {
    const result = await cotalkerAPI.get(`/api/v2/properties/code/${propertyCode}`, silent)
    if (result.status < 300) return result.data.data
    return null
}

export const getAllFromPropertyType = async (propertyType, silent) => {
    let count = 0, page = 1
    let properties = []
    do {
        const result = await cotalkerAPI.get(
            `/api/v2/properties?propertyTypes=${propertyType}&page=${page}&count=true&limit=100`,
        silent)
        properties = properties.concat(result.data.data.properties)
        count = result.data.data.count ?? 0
        page++
    } while (properties.length < count)
    return properties
}

export const findProperty = async (query, silent = true) => {
    const result = await cotalkerAPI.post(`/api/properties/find`, query, silent)
    if (result.status < 300) return result.data
    return null
}