import moment from 'moment'
import { CustomContextMessage, Markup } from 'telegraf'
import api from '../../api'
import { cbQueryTypes, remindDays, replies } from '../strings'

const markup: any = Markup

export default async function(payload: string[], ctx: CustomContextMessage) {
    if (!ctx.callbackQuery) return

    const [eventID] = payload

    const event = await api.get(Number(eventID))

    const startDate = moment(event.time.dates[0])
    const diff = startDate.diff(moment(), 'day')
    const msgID = ctx.callbackQuery.message ? ctx.callbackQuery.message.message_id : 0

    if (diff === 0) {
        ctx.replyWithHTML(replies.lateForReminders, { reply_to_message_id: msgID })
    } else {
        const buttonsRow: any[] = []

        remindDays.forEach(({ days, text }) => {
            if (diff >= days) {
                const data = `${cbQueryTypes['reminder-new']}|${event.id}:${days}:${msgID}`
                buttonsRow.push(markup.callbackButton(text, data))
            }
        })

        ctx.replyWithHTML(replies.whenToRemind, markup.inlineKeyboard(buttonsRow).extra({ reply_to_message_id: msgID }))
    }
}