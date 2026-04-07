import { status } from 'elysia'
import { recalculateRatingsFromContest } from '../../contest/updateRating'
import { prisma } from '../../prisma'
import { syncContestInfo } from '../../scraper/initContest'

export abstract class CreateService {
  static async createContest(userId: number, contestId: number) {
    const adminNicknames = (process.env.ADMIN_NICKNAMES ?? '')
      .split(',')
      .map((name) => name.trim())
      .filter((name) => name.length > 0)

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { nickname: true, xsytoken: true },
    })

    if (!user) {
      return status(403, {
        success: false as const,
        message: 'Unauthorized',
      })
    }

    if (!adminNicknames.includes(user.nickname)) {
      return status(403, {
        success: false as const,
        message: 'Forbidden: admin permission required',
      })
    }

    if (!user?.xsytoken) {
      return status(400, {
        success: false as const,
        message: 'Current user has no xsytoken. Please register with a valid token first.',
      })
    }

    try {
      await syncContestInfo(user.xsytoken, contestId)
      await recalculateRatingsFromContest(contestId)
      return {
        success: true as const,
        message: `Contest ${contestId} created and ratings recalculated.`,
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return status(500, {
        success: false as const,
        message: `Failed to create contest: ${message}`,
      })
    }
  }
}
