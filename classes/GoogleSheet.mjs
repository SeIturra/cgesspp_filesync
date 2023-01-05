import { GoogleAuth } from 'google-auth-library'
import { google } from 'googleapis'

export default class GoogleSheet {
  static _sheetCache = {} 
  static _defaultAuth = new GoogleAuth({
    keyFile: 'g-credentials.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets'
  })
  static _client 
  static _sheetsConector = google.sheets({ version: 'v4' })
  constructor(
    _sheetData,
    _auth,
    sheetId
    ) {
      this._sheetData = _sheetData
      this._auth = _auth
      this.sheetId = sheetId
    }
    static async fromId(sheetId, keyFile) {
      if (GoogleSheet._sheetCache[sheetId]) return GoogleSheet._sheetCache[sheetId]
      const auth = keyFile ? new GoogleAuth({
        keyFile, scopes: 'https://www.googleapis.com/auth/spreadsheets'
      }) : GoogleSheet._auth
      const sheet = await GoogleSheet._sheetsConector.spreadsheets.get({
        auth, spreadsheetId: sheetId,
      })
      const gSheet = new GoogleSheet(sheet.data, auth, sheetId)
      GoogleSheet._sheetCache[sheetId] = gSheet
      return gSheet
    }
    async getValuesInRange(sheetTitle, range) {
      const _range = range ? `${sheetTitle}!${range}`:sheetTitle
      return (await GoogleSheet._sheetsConector.spreadsheets.values.get({
        auth: this._auth, spreadsheetId: this.sheetId,
        range: _range
      })).data
    }
    logData() {
      console.log(JSON.stringify(this._sheetData, null, 2))
    }
  }
  