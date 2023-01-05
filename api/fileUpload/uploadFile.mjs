import { cotalkerAPIHeaders } from '../APIClient.mjs'

export const uploadFile = async (body, fileName, silent = true) => {
    const result = await cotalkerAPIHeaders({
        'Content-Disposition': `form-data; name="file"; filename="${fileName}"`,
    }).postFile(`/api/v3/media/file/upload`, body, silent)
    if (result.status < 300) return result.data
    return null
}