import { status } from 'elysia'
import { prisma } from '../../prisma'

export abstract class RatingService {
  static async list() {
    const rows = await prisma.user.findMany({
      select: {
        nickname: true,
        rating: true,
      },
      orderBy: [{ rating: 'desc' }, { nickname: 'asc' }],
    })

    return {
      success: true as const,
      data: rows,
    }
  }

  static async getByNickname(nickname: string) {
    const row = await prisma.user.findUnique({
      where: { nickname },
      select: {
        nickname: true,
        rating: true,
      },
    })

    if (!row) {
      return status(404, { success: false as const, message: 'User not found' })
    }

    return {
      success: true as const,
      data: row,
    }
  }
}
