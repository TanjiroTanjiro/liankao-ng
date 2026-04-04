import { PrismaClient, Prisma } from '../generated/prisma/client';
import { prisma } from '../prisma';

const INITIAL_RATING = 1500;

type Contestant = {
  participationId: number;
  userId: number;
  rank: number;
  points: number;
  rating: number;
  needRating: number;
  seed: number;
  delta: number;
};

function eloWinProbability(ra: number, rb: number): number {
  return 1.0 / (1 + Math.pow(10, (rb - ra) / 400.0));
}

function sortByPointsDesc(contestants: Contestant[]): void {
  contestants.sort((a, b) => b.points - a.points || a.userId - b.userId);
}

function sortByRatingDesc(contestants: Contestant[]): void {
  contestants.sort((a, b) => b.rating - a.rating || a.userId - b.userId);
}

function reassignRanks(contestants: Contestant[]): void {
  sortByPointsDesc(contestants);
  if (contestants.length === 0) return;

  for (const contestant of contestants) {
    contestant.rank = 0;
    contestant.delta = 0;
    contestant.seed = 0;
    contestant.needRating = 0;
  }

  let first = 0;
  let points = contestants[0].points;
  for (let i = 1; i < contestants.length; i++) {
    if (contestants[i].points < points) {
      for (let j = first; j < i; j++) contestants[j].rank = i;
      first = i;
      points = contestants[i].points;
    }
  }

  const lastRank = contestants.length;
  for (let j = first; j < contestants.length; j++) contestants[j].rank = lastRank;
}

function getSeed(contestants: Contestant[], rating: number): number {
  let result = 1;
  for (const other of contestants) {
    result += eloWinProbability(other.rating, rating);
  }
  return result;
}

function getRatingToRank(contestants: Contestant[], targetRank: number): number {
  let left = 1;
  let right = 8000;

  while (right - left > 1) {
    const mid = Math.floor((left + right) / 2);
    if (getSeed(contestants, mid) < targetRank) {
      right = mid;
    } else {
      left = mid;
    }
  }

  return left;
}

function validateDeltas(contestants: Contestant[]): void {
  sortByPointsDesc(contestants);

  for (let i = 0; i < contestants.length; i++) {
    for (let j = i + 1; j < contestants.length; j++) {
      const a = contestants[i];
      const b = contestants[j];

      if (a.rating > b.rating && a.rating + a.delta < b.rating + b.delta) {
        throw new Error(`First rating invariant failed: user ${a.userId} vs ${b.userId}`);
      }

      if (a.rating < b.rating && a.delta < b.delta) {
        throw new Error(`Second rating invariant failed: user ${a.userId} vs ${b.userId}`);
      }
    }
  }
}

function processContestants(contestants: Contestant[]): void {
  if (contestants.length === 0) return;

  reassignRanks(contestants);

  for (const a of contestants) {
    a.seed = 1;
    for (const b of contestants) {
      if (a !== b) {
        a.seed += eloWinProbability(b.rating, a.rating);
      }
    }
  }

  for (const contestant of contestants) {
    const midRank = Math.sqrt(contestant.rank * contestant.seed);
    contestant.needRating = getRatingToRank(contestants, midRank);
    contestant.delta = Math.trunc((contestant.needRating - contestant.rating) / 2);
  }

  sortByRatingDesc(contestants);

  {
    let sum = 0;
    for (const c of contestants) sum += c.delta;
    const inc = Math.trunc(-sum / contestants.length) - 1;
    for (const c of contestants) c.delta += inc;
  }

  {
    const zeroSumCount = Math.min(
      Math.trunc(4 * Math.round(Math.sqrt(contestants.length))),
      contestants.length,
    );
    let sum = 0;
    for (let i = 0; i < zeroSumCount; i++) sum += contestants[i].delta;
    const inc = Math.min(Math.max(Math.trunc(-sum / zeroSumCount), -10), 0);
    for (const c of contestants) c.delta += inc;
  }

  validateDeltas(contestants);
}

function rankFromScores(rows: Array<{ userId: number; totalScore: number }>): Map<number, number> {
  const sorted = [...rows].sort((a, b) => b.totalScore - a.totalScore || a.userId - b.userId);
  const rankByUserId = new Map<number, number>();
  if (sorted.length === 0) return rankByUserId;

  let first = 0;
  let points = sorted[0].totalScore;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].totalScore < points) {
      for (let j = first; j < i; j++) rankByUserId.set(sorted[j].userId, i);
      first = i;
      points = sorted[i].totalScore;
    }
  }

  const lastRank = sorted.length;
  for (let j = first; j < sorted.length; j++) rankByUserId.set(sorted[j].userId, lastRank);

  return rankByUserId;
}

async function loadContests(): Promise<Array<{ id: number; endTime: Date }>> {
  return prisma.contest.findMany({
    select: { id: true, endTime: true },
    orderBy: [{ endTime: 'asc' }, { id: 'asc' }],
  });
}

async function loadContestantsFromDb(
  contestId: number,
  ratings: Map<number, number>,
): Promise<Contestant[]> {
  const rows = await prisma.participation.findMany({
    where: { contestId },
    select: {
      id: true,
      userId: true,
      totalScore: true,
      rank: true,
    },
  });

  const ranks = rankFromScores(rows.map((row) => ({ userId: row.userId, totalScore: row.totalScore })));

  return rows.map((row) => ({
    participationId: row.id,
    userId: row.userId,
    rank: ranks.get(row.userId) ?? row.rank,
    points: row.totalScore,
    rating: ratings.get(row.userId) ?? INITIAL_RATING,
    needRating: 0,
    seed: 0,
    delta: 0,
  }));
}

async function createBatch(
  tx: Prisma.TransactionClient,
  startContestId: number,
  mode: string,
): Promise<number> {
  const batch = await tx.ratingCalculationBatch.create({
    data: {
      startContestId,
      mode,
    },
    select: { id: true },
  });
  return batch.id;
}

async function persistContestResult(
  tx: Prisma.TransactionClient,
  batchId: number,
  contestId: number,
  contestants: Contestant[],
  ratings: Map<number, number>,
): Promise<void> {
  for (const c of contestants) {
    const newRating = c.rating + c.delta;

    await tx.ratingParticipationChange.create({
      data: {
        batchId,
        contestId,
        participationId: c.participationId,
        userId: c.userId,
        beforeRank: c.rank,
        afterRank: c.rank,
        beforePostContestRating: null,
        afterPostContestRating: newRating,
      },
    });

    await tx.ratingUserChange.create({
      data: {
        batchId,
        contestId,
        userId: c.userId,
        beforeRating: c.rating,
        afterRating: newRating,
      },
    });

    await tx.participation.update({
      where: { id: c.participationId },
      data: {
        rank: c.rank,
        postContestRating: newRating,
      },
    });

    await tx.user.update({
      where: { id: c.userId },
      data: { rating: newRating },
    });

    ratings.set(c.userId, newRating);
  }
}

async function recalculateRatingsFromContest(contestId: number): Promise<void> {
  const contests = await loadContests();
  const startIndex = contests.findIndex((contest) => contest.id === contestId);
  if (startIndex === -1) {
    throw new Error(`Contest ${contestId} not found.`);
  }

  const users = await prisma.user.findMany({ select: { id: true } });
  const ratings = new Map<number, number>();
  for (const user of users) ratings.set(user.id, INITIAL_RATING);

  for (let i = 0; i < startIndex; i++) {
    const contest = contests[i];
    const contestants = await loadContestantsFromDb(contest.id, ratings);
    if (contestants.length === 0) continue;
    processContestants(contestants);
    for (const c of contestants) ratings.set(c.userId, c.rating + c.delta);
  }

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const batchId = await createBatch(tx, contestId, 'RECALCULATE_FROM_CONTEST');

    for (let i = startIndex; i < contests.length; i++) {
      const contest = contests[i];
      const contestants = await loadContestantsFromDb(contest.id, ratings);
      if (contestants.length === 0) continue;

      processContestants(contestants);
      await persistContestResult(tx, batchId, contest.id, contestants, ratings);
    }

    await tx.ratingCalculationBatch.update({
      where: { id: batchId },
      data: { completedAt: new Date() },
    });
  });
}

async function undoLatestRatingCalculation(): Promise<void> {
  const batch = await prisma.ratingCalculationBatch.findFirst({
    where: { completedAt: { not: null }, revertedAt: null },
    orderBy: [{ completedAt: 'desc' }, { id: 'desc' }],
  });

  if (!batch) {
    throw new Error('No completed rating batch found to undo.');
  }

  const userChanges = await prisma.ratingUserChange.findMany({
    where: { batchId: batch.id },
    orderBy: { id: 'desc' },
  });

  const participationChanges = await prisma.ratingParticipationChange.findMany({
    where: { batchId: batch.id },
    orderBy: { id: 'desc' },
  });

  await prisma.$transaction(async (tx) => {
    for (const change of participationChanges) {
      await tx.participation.update({
        where: { id: change.participationId },
        data: {
          rank: change.beforeRank,
          postContestRating: change.beforePostContestRating,
        },
      });
    }

    for (const change of userChanges) {
      await tx.user.update({
        where: { id: change.userId },
        data: { rating: change.beforeRating },
      });
    }

    await tx.ratingCalculationBatch.update({
      where: { id: batch.id },
      data: { revertedAt: new Date() },
    });
  });
}

export {
  recalculateRatingsFromContest,
  undoLatestRatingCalculation,
};
