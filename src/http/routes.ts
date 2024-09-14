import z from 'zod'
import { app } from './server'
import { createGoal } from '../functions/create-goal'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { getWeekPendingGoals } from '../functions/incomplete-week-goal'
import { createGoalCompletion } from '../functions/create-goal-completion'
import { getWeekSummary } from '../functions/get-week-summary'

export async function routes() {
  app.post('/goals', {}, async (req: FastifyRequest, reply: FastifyReply) => {
    const createGoalSchema = z.object({
      title: z.string(),
      desiredWeeklyFrequency: z.number().int().min(1).max(7),
    })

    const body = createGoalSchema.parse(req.body)

    await createGoal({
      title: body.title,
      desiredWeeklyFrequency: body.desiredWeeklyFrequency,
    })

    reply.code(201)
    reply.send('Tarefa criada com sucesso')
  })

  app.get('/pending', async () => {
    const pendingGoals = await getWeekPendingGoals()

    return pendingGoals
  })

  app.post('/completions', async (req: FastifyRequest, reply: FastifyReply) => {
    const createGoalCompletionSchema = z.object({
      goalId: z.string(),
    })

    const body = createGoalCompletionSchema.parse(req.body)

    await createGoalCompletion({
      goalId: body.goalId,
    })
  })

  app.get('/summary', async () => {
    const { summary } = await getWeekSummary()

    return { summary }
  })
}
