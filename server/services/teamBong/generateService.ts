import type {
  GeneratedBong,
  TeamMemberPrediction,
  GeneratedPrediction,
} from '~~/server/utils/bong/types'
import {
  calculateEventVotes,
  groupPredictionsByEvent,
} from '~~/server/utils/bong/calculators'
import type { TeamLean } from '~~/shared/types/team'

type ConfidenceLevel = 'SAFE' | 'NEUTRAL' | 'UNSURE'
interface PopulatedBong {
  userId: {
    _id: string
    name: string
  }
  drawNumber: number
  drawComment: string
  closeTime: Date
  predictions: BongPrediction[]
}

interface BongPrediction {
  eventNumber: number
  outcome: string[]
  confidence: ConfidenceLevel
  description: string
  sportEventId: number
}

interface TeamMember {
  userId: {
    toString(): string
  }
}

export async function generateTeamBong(
  teamId: string,
  drawNumber: number
): Promise<GeneratedBong> {
  const team = await Team.findById(teamId).lean<TeamLean>()

  if (!team) {
    throw new Error('Team not found')
  }

  const memberIds = team.members.map((m: TeamMember) => m.userId.toString())

  const bongs = await EventBong.find({
    userId: { $in: memberIds },
    drawNumber,
  })
    .populate('userId', 'name')
    .lean<PopulatedBong[]>()

  if (bongs.length === 0) {
    throw new Error('No bongs found for this draw')
  }

  const allPredictions: TeamMemberPrediction[] = []

  bongs.forEach((bong: PopulatedBong) => {
    bong.predictions.forEach((pred: BongPrediction) => {
      allPredictions.push({
        userId: bong.userId._id.toString(),
        userName: bong.userId.name,
        eventNumber: pred.eventNumber,
        outcome: pred.outcome,
        confidence: pred.confidence,
      })
    })
  })

  const groupedByEvent = groupPredictionsByEvent(allPredictions)

  const generatedPredictions: GeneratedPrediction[] = []
  const eventDescriptions = new Map<
    number,
    { description: string; sportEventId: number }
  >()

  bongs[0].predictions.forEach((pred: BongPrediction) => {
    eventDescriptions.set(pred.eventNumber, {
      description: pred.description,
      sportEventId: pred.sportEventId,
    })
  })

  groupedByEvent.forEach((predictions, eventNumber) => {
    const votes = calculateEventVotes(predictions)
    const eventInfo = eventDescriptions.get(eventNumber)

    if (eventInfo) {
      generatedPredictions.push({
        eventNumber,
        outcome: votes.suggestedOutcome,
        confidence: votes.confidence,
        description: eventInfo.description,
        sportEventId: eventInfo.sportEventId,
      })
    }
  })

  generatedPredictions.sort((a, b) => a.eventNumber - b.eventNumber)

  const firstBong = bongs[0]

  return {
    drawNumber: firstBong.drawNumber,
    drawComment: firstBong.drawComment,
    closeTime: firstBong.closeTime.toISOString(),
    predictions: generatedPredictions,
    metadata: {
      teamSize: memberIds.length,
      participatingMembers: bongs.length,
      strategy: 'confidence-weighted',
    },
  }
}
