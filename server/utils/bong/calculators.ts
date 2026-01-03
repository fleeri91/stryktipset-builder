import type { TeamMemberPrediction, EventVotes } from './types'

// Confidence weights
const CONFIDENCE_WEIGHTS = {
  SAFE: 3,
  NEUTRAL: 2,
  UNSURE: 1,
}

/**
 * Calculate weighted votes for a single event
 */
export function calculateEventVotes(
  predictions: TeamMemberPrediction[]
): EventVotes {
  const votes = { '1': 0, X: 0, '2': 0 }

  // Count weighted votes for each outcome
  predictions.forEach((pred) => {
    const weight = CONFIDENCE_WEIGHTS[pred.confidence]
    pred.outcome.forEach((outcome) => {
      if (outcome === '1' || outcome === 'X' || outcome === '2') {
        votes[outcome] += weight
      }
    })
  })

  // Find the outcome(s) with the most votes
  const maxVotes = Math.max(votes['1'], votes['X'], votes['2'])
  const suggestedOutcome = (
    Object.keys(votes) as Array<'1' | 'X' | '2'>
  ).filter((outcome) => votes[outcome] === maxVotes)

  // Determine confidence based on vote concentration
  const totalVotes = votes['1'] + votes['X'] + votes['2']
  const confidence = calculateConfidence(
    maxVotes,
    totalVotes,
    predictions.length
  )

  return {
    eventNumber: predictions[0].eventNumber,
    description: '',
    votes,
    suggestedOutcome,
    confidence,
    totalVotes,
  }
}

/**
 * Calculate confidence level based on vote distribution
 */
function calculateConfidence(
  maxVotes: number,
  totalVotes: number,
  teamSize: number
): 'SAFE' | 'NEUTRAL' | 'UNSURE' {
  if (totalVotes === 0) return 'UNSURE'

  const concentration = maxVotes / totalVotes
  const participation = teamSize // Could track actual participation

  // High concentration (>70%) and good participation = SAFE
  if (concentration >= 0.7) {
    return 'SAFE'
  }

  // Medium concentration (50-70%) = NEUTRAL
  if (concentration >= 0.5) {
    return 'NEUTRAL'
  }

  // Low concentration (<50%) = UNSURE
  return 'UNSURE'
}

/**
 * Group predictions by event number
 */
export function groupPredictionsByEvent(
  predictions: TeamMemberPrediction[]
): Map<number, TeamMemberPrediction[]> {
  const grouped = new Map<number, TeamMemberPrediction[]>()

  predictions.forEach((pred) => {
    if (!grouped.has(pred.eventNumber)) {
      grouped.set(pred.eventNumber, [])
    }
    grouped.get(pred.eventNumber)!.push(pred)
  })

  return grouped
}
