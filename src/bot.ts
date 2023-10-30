import { Telegraf } from 'telegraf'
import { message } from "telegraf/filters"

import 'dotenv/config'
import { addUser, getInfo, addQuote, addMessage } from './dynamo'

// Telegram functions.
const quote = async (context: any) => {
    // Get user.
    let user = context.from.first_name

    // Get quote.

    return `Hi <strong>${user}</strong>`;
}

// Telegram Bot.
const { BOT_TOKEN } = process.env
if (!BOT_TOKEN) throw new Error('"BOT_TOKEN" env var is required!')

// Telegraf constructor accepts a custom Context type
const bot = new Telegraf(BOT_TOKEN);


// quote.
bot.command('quote', async (context: any) => {
    context.reply(await quote(context), { parse_mode: 'HTML' })
})

// add.
bot.command('add', async (context: any) => {
    let userID = context.from.id.toString()

    // let email;
    // let password;

    // //Something like this
    // ctx.reply("Enter your email");
    // email = await ctx.message?.text;

    // ctx.reply("Enter your password");
    // password = await ctx.message?.text;

    // console.log(email)
    // console.log(password)

    let quote = ''
    let author = ''

    await addQuote(userID, quote, author)
    context.reply('Your')
})

// info.
bot.command('info', async (context: any) => {
    let userID = context.from.id.toString()
    let info= await(getInfo(userID))
    console.log(info)
    // let html = `<b>Info:</b>
    // - userID: ${info?.userID?.N }
    // - rol: ${info?.rol?.S}`
    // context.reply(html, { parse_mode: 'HTML' })
})

bot.on(message("text"), ctx => {
    let user_id = ctx.from.id.toString()
    let message_id = ctx.message.message_id.toString()
    let date = ctx.message.date.toString()
    let text = ctx.message.text
    addMessage(message_id, user_id, date, text)
});


// Telegram command.
bot.telegram.setMyCommands([
    {
        command: 'quote',
        description: 'Get a quote',
    },
    {
        command: 'add',
        description: 'Add a quote.',
    },
    {
        command: 'info',
        description: 'Get info.',
    }
])

bot.start((context) => {
    addUser(context)
    context.reply('Hello ' + context.from.first_name + '!')
})


// Inicia el bot.
bot.launch()