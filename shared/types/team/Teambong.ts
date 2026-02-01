// Team Bongs - Summary view for recent activity
export interface TeamBong {
  _id: string
  userId: string
  userName: string
  drawNumber: number
  drawComment: string
  closeTime: string
  predictionsCount: number
  createdAt: string
}

// Team Draw Bong - Detailed view for specific draw comparison
export interface TeamDrawBong {
  _id: string
  user: {
    _id: string
    name: string
    email: string
  }
  drawNumber: number
  drawComment: string
  closeTime: string
  predictions: TeamBongPrediction[]
  createdAt: string
}

export interface TeamBongPrediction {
  eventNumber: number
  outcome: string[]
  confidence: string
  description: string
}
