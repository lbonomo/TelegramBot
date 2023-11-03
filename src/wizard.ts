import { Scenes, session, Telegraf } from "telegraf"


import 'dotenv/config'

const superWizard = new Scenes.WizardScene(
  'super-wizard',
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
const stage = new Scenes.Stage([superWizard]);

// Telegram Bot.
const { BOT_TOKEN } = process.env
if (!BOT_TOKEN) throw new Error('"BOT_TOKEN" env var is required!')

// Telegraf constructor accepts a custom Context type
const bot = new Telegraf(BOT_TOKEN);

bot.use(session());
bot.use(stage.middleware());
bot.command('add', (ctx:any) => {
  ctx.scene.enter('super-wizard');
});
bot.launch();