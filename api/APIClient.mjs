import fetch from "node-fetch"

export default class APIClient {
    constructor(baseUrl, headers, customHeaders = {}) {
        this.baseUrl = baseUrl
        this.headers = {...headers, ...customHeaders}
    }
    _log(msg, silent) {
        if (!silent) console.log(msg)
    }
    async get(path, silent) {
        const url = `${this.baseUrl}${path}`
        const response = await fetch(url, {
            headers: this.headers,
            method: 'GET'
        })
        const result = {
            status: response.status, data: {}
        }
        if (response.ok) result.data = await response.json()
        else {
            result.data = await response.text()
            this._log(`
                GET request to ${url} failed with status ${result.status}
                Response Body: ${result.data}`, silent)
        }
        return result
    }
    async post(path, body, silent) {
        const url = `${this.baseUrl}${path}`
        const response = await fetch(url, {
            method: 'POST', headers: this.headers,
            body: JSON.stringify(body)
        })
        const result = { status: response.status }
        if (response.ok) result.data = await response.json()
        else {
            result.data = await response.text()
            this._log(`
                POST request to ${url} failed with status ${result.status}
                Request Body: ${JSON.stringify(body, null, 2)}
                Respose Body: ${result.data}`, silent)
        }
        return result
    }
    async patch(path, body, silent, bodyString = true) {
        const url = `${this.baseUrl}${path}`
        const response = await fetch(url, {
            method: 'PATCH', headers: this.headers,
            body: JSON.stringify(body)
        })
        const result = { status: response.status }
        if (response.ok) result.data = await response.json()
        else {
            result.data = await response.text()
            this._log(`
                PATCH request to ${url} failed with status ${result.status}
                Request Body: ${JSON.stringify(body, null, 2)}
                Respose Body: ${result.data}`, silent)
        }
        return result
    }
    async postFile(path, body, silent) {
        const url = `${this.baseUrl}${path}`
        
            const response = await fetch(url, {
                method: 'POST', headers: this.headers,
                body
            })
            const result = { status: response.status }
            if (response.ok) result.data = await response.json()
            else {
                // console.log('error response: ' + await response.text())
                result.data = await response.text()
                this._log(`
                    POST request to ${url} failed with status ${result.status}
                    Request Body: ${JSON.stringify(body, null, 2)}
                    Respose Body: ${result.data}`, silent)
            }
            return result
            /*
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('request was aborted');
            }
            console.log(error)
            return null
        }*/
        
    }
}

export const cotalkerAPI = new APIClient(process.env.BASE_URL, {
    'admin': 'true',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.COTALKER_TOKEN}`
})

export const cotalkerAPIHeaders = (headers) => new APIClient(process.env.BASE_URL, {
    'admin': 'true',
    'Authorization': `Bearer ${process.env.COTALKER_TOKEN}`,
    ...headers
})