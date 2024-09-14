import { client, db } from './index'
import { goalCompletions, goals } from './schema'
import dayjs from 'dayjs'

async function seed() {
  await db.delete(goalCompletions)
  await db.delete(goals)

  const result = await db
    .insert(goals)
    .values([
      { title: 'Acordar Cedo', desiredWeeklyFrequency: 5 },
      { title: 'Exercitar', desiredWeeklyFrequency: 3 },
      { title: 'Leitura', desiredWeeklyFrequency: 3 },
    ])
    .returning()

  const weekStart = dayjs().startOf('week')

  await db.insert(goalCompletions).values([
    { goalId: result[0].id, created_at: weekStart.toDate() },
    { goalId: result[1].id, created_at: weekStart.add(1, 'day').toDate() },
  ])
}

seed().finally(() => client.end())
