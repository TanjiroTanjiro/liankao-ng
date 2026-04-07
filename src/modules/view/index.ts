import { Elysia, t } from "elysia";
import { prisma } from "./../../prisma";
import { authGuard } from "../../plugins/auth-guard";

export const view = new Elysia({ prefix : '/view' })
    .use(authGuard)
    .get(
        '/contests',
        async ( { query } ) => {
            const { order } = query
            let orderBy : any = {
                startTime: 'desc'
            }
            if ( order == 'desc' ) {
                orderBy = {
                    qualities: 'desc'
                }
            }
            if ( order == 'asc' ){
                orderBy = {
                    qualities: 'asc'
                }
            }
            const contests = await prisma.contest.findMany({
                select: {
                    id : true,
                    name: true,
                    description: true,
                    startTime: true,
                    endTime: true,
                    qualities: true,
                    type: true,
                },
                orderBy: orderBy
            })
            return {
                success : true,
                data : contests
            }
        },
        {
            query: t.Object({
                order: t.Optional(t.String())
            })
        }
    ).get(
        '/contests/:contestId',
        async ( { params } ) => {
            const { contestId } = params
            const contest = await prisma.contest.findUnique({
                where: {
                    id: Number(contestId)
                },
            })
            return {
                success : true,
                data : contest
            }
        }
    ).get(
        '/tasks',
        async ( { query } ) => {
            const { order } = query
            let orderBy : any = {
                startTime: 'desc'
            }
            if ( order == 'desc' ) {
                orderBy = {
                    qualities: 'desc'
                }
            }
            if ( order == 'asc' ){
                orderBy = {
                    qualities: 'asc'
                }
            }
            const contests = await prisma.problem.findMany({
                select: {
                    id : true,
                    difficulties: true,
                    qualities: true,
                    name: true,
                    description: true,
                },
                orderBy: orderBy
            })
            return {
                success : true,
                data : contests
            }
        },
        {
            query: t.Object({
                order: t.Optional(t.String())
            })
        }
    ).get(
        '/tasks/:taskId',
        async ( { params } ) => {
            const { taskId } = params
            const task = await prisma.problem.findUnique({
                where: {
                    id: Number(taskId)
                },
            })
            return {
                success : true,
                data : task
            }
        }
    ).get(
        'contestof/:taskid',
        async ( { params } ) => {
            const { taskid } = params
            const contest = await prisma.contestProblem.findMany({
                where: {
                    problemId: Number(taskid)
                },
                select: {
                    contestId: true
                }
            })
            return {
                success : true,
                data : contest
            }
        }
    )
