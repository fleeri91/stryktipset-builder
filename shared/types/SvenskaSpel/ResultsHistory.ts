export interface ResultsHistoryRoot {
  product: string
  live: boolean
  year: number
  month: number
  resultDates: ResultDate[]
  error: any
  requestInfo: RequestInfo
  requestId: string
  sessionId: any
  deviceId: string
  session: any
  sessionUser: any
  clientInfo: any
}

export interface ResultDate {
  date: string
  openDate: any
  closeDate: string
  product: string
  drawNumber: number
  drawState: string
  drawStateId: number
}

export interface RequestInfo {
  elapsedTime: number
  apiVersion: number
}
