import { CustomContextMessage } from 'telegraf'
import db from '../../db'
import { replies } from '../strings'

// export default async function(payload: string[], ctx: CustomContextMessage) {
export default async function(payload, ctx) {
    const [reminderID] = payload

    await db.reminders.delete(Number(reminderID))
    ctx.replyWithHTML(replies.reminderDeleted)

    ctx.deleteMessage()
}