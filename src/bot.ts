import { Markup, Telegraf } from 'telegraf'
import { message } from "telegraf/filters"

import 'dotenv/config'
import { addUser, getInfo, addQuote, addMessage } from './dynamo'
import { Update } from 'telegraf/typings/core/types/typegram'
import { nextTick } from 'process'

// Telegram functions.
const quote = async (context: any) => {
    // Get user.
    let user = context.from.first_name

    // Get quote.

    return `Hi <strong>${user}</strong>`;
}

const add = async (ctx:any, bot:any) => {
    ctx.reply("Insert BTC Wallet Address for the payment: ");
    bot.on("text", async (ctx:any) => {
         await ctx.telegram
             .sendMessage(ctx.message.chat.id, ctx.message.chat)
             .then(() => {
                  ctx.reply(`Your wallet address is: {ctx.update.message.text}`)
              });
    });
}

// const question = new Scenes.BaseScene("question");
// question.enter(ctx => ctx.reply("Enter token"));
// question.on(message("text"), async ctx => {
// 	// validate
// 	ctx.session.token = ctx.message.text;
// 	await ctx.reply("Accepted");
// 	return ctx.scene.leave();
// });

// Telegram Bot.
const { BOT_TOKEN } = process.env
if (!BOT_TOKEN) throw new Error('"BOT_TOKEN" env var is required!')

// Telegraf constructor accepts a custom Context type
const bot = new Telegraf(BOT_TOKEN);

// Middleware.
bot.use(async (context:any, next) => {
    await context.reply(JSON.stringify(context.update, null, 2))
    next()
})

// const stage = new Scenes.Stage([question]);
// bot.use( stage.middleware() );

// quote.
bot.command('quote', async (context: any) => {
    context.reply(await quote(context), { parse_mode: 'HTML' })
})

// add.
bot.command('add', async (context: any) => {
    let userID = context.from.id.toString()
    // context.scene.enter("question")
    // let data = await

    // console.log(data)
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

    await add(context, bot)

    await addQuote(userID, quote, author)
    context.reply('Your quote has saved')
})

// info.
bot.command('info', async (context: any) => {
    let userID = context.from.id.toString()
    let info:any = await(getInfo(userID))
    let html = `<b>Info:</b>
    - ID: ${info?.userID?.N }
    - Rol: ${info?.rol?.S}`
    context.reply(html, { parse_mode: 'HTML' })
})

// Save all message on DynamoDB.
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

bot.action('quote', async (context: any) => {
    await context.reply( quote(context), { parse_mode: 'HTML' })
})


const inlineQuote = Markup.inlineKeyboard([
    Markup.button.callback('Quote', 'quote')
]
)


const replyKeyboard = Markup.keyboard([
    ['Quote']
]).resize()

bot.use(async (context:any, next) => {
    await context.reply('Quote', replyKeyboard)
    next()
}

)
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))