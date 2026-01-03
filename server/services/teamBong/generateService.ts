import type {
  GeneratedBong,
  TeamMemberPrediction,
  GeneratedPrediction,
} from '../../utils/bong/types'
import {
  calculateEventVotes,
  groupPredictionsByEvent,
} from '../../utils/bong/calculators'

/**
 * Generate a suggested team bong based on all team members' predictions
 */
export async function generateTeamBong(
  teamId: string,
  drawNumber: number
): Promise<GeneratedBong> {
  // Fetch all team bongs for this draw
  const team: any = await Team.findById(teamId).lean()

  if (!team) {
    throw new Error('Team not found')
  }

  const memberIds = team.members.map((m: any) => m.userId.toString())

  const bongs: any = await EventBong.find({
    userId: { $in: memberIds },
    drawNumber,
  })
    .populate('userId', 'name')
    .lean()

  if (bongs.length === 0) {
    throw new Error('No bongs found for this draw')
  }

  // Extract all predictions with user info
  const allPredictions: TeamMemberPrediction[] = []

  bongs.forEach((bong: any) => {
    bong.predictions.forEach((pred: any) => {
      allPredictions.push({
        userId: bong.userId._id.toString(),
        userName: bong.userId.name,
        eventNumber: pred.eventNumber,
        outcome: pred.outcome,
        confidence: pred.confidence,
      })
    })
  })

  // Group by event number
  const groupedByEvent = groupPredictionsByEvent(allPredictions)

  // Calculate suggested outcome for each event
  const generatedPredictions: GeneratedPrediction[] = []
  const eventDescriptions = new Map<
    number,
    { description: string; sportEventId: number }
  >()

  // Store descriptions and sportEventIds from original bongs
  bongs[0].predictions.forEach((pred: any) => {
    eventDescriptions.set(pred.eventNumber, {
      description: pred.description,
      sportEventId: pred.sportEventId,
    })
  })

  // Calculate votes for each event
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

  // Sort by event number
  generatedPredictions.sort((a, b) => a.eventNumber - b.eventNumber)

  // Use first bong's draw info
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
