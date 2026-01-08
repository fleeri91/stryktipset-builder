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
  drawState: DrawState
  drawStateId: number
}

export enum DrawState {
  Finalized = 'Finalized',
  Open = 'Open',
}

export interface RequestInfo {
  elapsedTime: number
  apiVersion: number
}
