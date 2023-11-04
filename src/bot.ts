import { Markup, Scenes, session, Telegraf } from 'telegraf'
// import { message } from "telegraf/filters"

import 'dotenv/config'
import { adduser, help, quote, info } from './libs'

const quoteWizard = new Scenes.WizardScene(
    'quote-wizard',
    (ctx:any) => {
      ctx.reply("Write the quote:");
      ctx.wizard.state.data = {};
      return ctx.wizard.next();
    },
    (ctx:any) => {
      ctx.wizard.state.data.quote = ctx.message.text;
      ctx.reply('Write the author of quote');
      return ctx.wizard.next();
    },
    (ctx:any) => {
      ctx.wizard.state.data.author = ctx.message.text;
      ctx.reply(`Your quote: ${ctx.wizard.state.data.quote}
  by: ${ctx.wizard.state.data.author}`
      );
      // Save quote.
      return ctx.scene.leave();
    }
  );


const stage = new Scenes.Stage([quoteWizard]);


// Telegram Bot.
const { BOT_TOKEN } = process.env
if (!BOT_TOKEN) throw new Error('"BOT_TOKEN" env var is required!')

// Telegraf constructor accepts a custom Context type
const bot = new Telegraf(BOT_TOKEN);

bot.use(session());
bot.use(stage.middleware());

// // Save all message on DynamoDB.
// Middleware.
// bot.use(async (context:any, next) => {
//     await context.reply(JSON.stringify(context.update, null, 2))
//     next()
// })

// TODO - Pasar a middelware.
// bot.on(message("text"), context => {
//     let user_id = context.from.id.toString()
//     let message_id = context.message.message_id.toString()
//     let date = context.message.date.toString()
//     let text = context.message.text
//     addMessage(message_id, user_id, date, text)
// });


// Commands.

// help.
bot.command('help', async (context: any) => {
    context.reply(help(context), { parse_mode: 'HTML' })
})

// quote.
bot.command('quote', async (context: any) => {
    context.reply(await quote(context), { parse_mode: 'HTML' })
})

// info.
bot.command('info', async (context: any) => {
    let html = await info(context)
    context.reply(html, { parse_mode: 'HTML' })
})

// add.
bot.command('add', async (context: any) => {
    let userID = context.from.id.toString()
    context.scene.enter('quote-wizard');
    // // context.scene.enter("question")
    // // let data = await

    // // console.log(data)
    // // let email;
    // // let password;

    // // //Something like this
    // // context.reply("Enter your email");
    // // email = await context.message?.text;

    // // context.reply("Enter your password");
    // // password = await context.message?.text;

    // // console.log(email)
    // // console.log(password)

    // let quote = ''
    // let author = ''

    // // await add(context, bot)

    // // await addQuote(userID, quote, author)
    // context.reply('Your quote has saved')
})


// Set Telegram command menu.
bot.telegram.setMyCommands([
    {
        command: 'help',
        description: 'Print the help',
    },
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





// Start function.
bot.start((context:any) => {
    adduser(context)
    context.reply('Hello ' + context.from.first_name + '!')
})


// Inicia el bot.
bot.launch()
