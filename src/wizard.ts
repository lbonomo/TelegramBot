import { Composer, Markup, Scenes, session, Telegraf } from "telegraf";
import 'dotenv/config'

const stepHandler = new Composer<Scenes.WizardContext>();
stepHandler.action("next", async ctx => {
	await ctx.reply("Step 2. Via inline button");
	return ctx.wizard.next();
});
stepHandler.command("next", async ctx => {
	await ctx.reply("Step 2. Via command");
	return ctx.wizard.next();
});
stepHandler.use(ctx =>
	ctx.replyWithMarkdown("Press `Next` button or type /next"),
);

const superWizard = new Scenes.WizardScene(
	"super-wizard",
	async ctx => {
		await ctx.reply(
			"Step 1",
			Markup.inlineKeyboard([
				Markup.button.url("❤️", "http://telegraf.js.org"),
				Markup.button.callback("➡️ Next", "next"),
			]),
		);
		return ctx.wizard.next();
	},
	stepHandler,
	async ctx => {
		await ctx.reply("Step 3");
		return ctx.wizard.next();
	},
	async ctx => {
		await ctx.reply("Step 4");
		return ctx.wizard.next();
	},
	async ctx => {
		await ctx.reply("Done");
		return await ctx.scene.leave();
	},
);
const { BOT_TOKEN } = process.env
if (!BOT_TOKEN) throw new Error('"BOT_TOKEN" env var is required!')
const bot = new Telegraf<Scenes.WizardContext>(BOT_TOKEN);
const stage = new Scenes.Stage<Scenes.WizardContext>([superWizard], {
	default: "super-wizard",
});
bot.use(session());
bot.use(stage.middleware());

bot.launch();