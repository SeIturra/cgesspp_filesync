import { cotalkerAPI } from '../APIClient.mjs'

export async function runSchedule(body) {
    return await cotalkerAPI.post('/api/uservices/scheduler/run', body)
}

export async function postSchedule(body) {
    return await cotalkerAPI.post('/api/uservices/scheduler', body)
}