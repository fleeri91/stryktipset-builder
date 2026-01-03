export interface TeamMemberPrediction {
  userId: string
  userName: string
  eventNumber: number
  outcome: string[]
  confidence: 'SAFE' | 'NEUTRAL' | 'UNSURE'
}

export interface EventVotes {
  eventNumber: number
  description: string
  votes: {
    '1': number
    X: number
    '2': number
  }
  suggestedOutcome: string[]
  confidence: 'SAFE' | 'NEUTRAL' | 'UNSURE'
  totalVotes: number
}

export interface GeneratedBong {
  drawNumber: number
  drawComment: string
  closeTime: string
  predictions: GeneratedPrediction[]
  metadata: {
    teamSize: number
    participatingMembers: number
    strategy: string
  }
}

export interface GeneratedPrediction {
  eventNumber: number
  outcome: string[]
  confidence: 'SAFE' | 'NEUTRAL' | 'UNSURE'
  description: string
  sportEventId: number
}
