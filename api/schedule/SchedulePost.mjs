import { postSchedule, runSchedule } from "./index.mjs"

export default class SchedulePost {
    constructor(body) {
        this.body = body
    }

    async run() {
        try {
        await this._prepare()
        const result= await runSchedule(this.body)
        return result
        } catch (error) {
        console.error(error)
        }
    }

    async post(datetime) {
        try {
         await this._prepare()
         const result= await postSchedule({ ...this.body, time: datetime ?? new Date() })
         return result
        } catch (error) {
         console.error(error)
        }
    }

  async _prepare() { return }
}
