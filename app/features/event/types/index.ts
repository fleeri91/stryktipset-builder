export type Outcome = '1' | 'X' | '2'
export type ConfidenceLevel = 'UNSURE' | 'NEUTRAL' | 'SAFE'

export interface EventSelection {
  eventNumber: number
  outcome: Outcome[]
  confidence: ConfidenceLevel
}
