const Telegraf = require('telegraf')
const Composer = require('telegraf/composer')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Extra = require('telegraf/extra') 
const Markup = require('telegraf/markup')
const WizardScene = require('telegraf/scenes/wizard')
const data = require('./data')


const superWizard = new WizardScene('super-wizard',
  (ctx) => {
    if (+ctx.chat.id < 0) {
      return
    }

    if (!ctx.message.text) {
      return ctx.reply('Введите Ваше имя')
    }

    ctx.reply(
      'Нажмите на кнопку "📱 Отправить телефон" или введите его вручную в международном формате +998711234567',
      Extra
        .markup(Markup.keyboard([
          [Markup.contactRequestButton('📱 Отправить телефон')]
        ]).resize().oneTime())
    )

    ctx.session.name = ctx.message.text
    return ctx.wizard.next()
  },
  (ctx) => {
    if (!ctx.message.text && !ctx.message.contact) {
      return ctx.reply('Введите Ваш номер или нажмите кнопку ниже')
    }

    ctx.reply(
      'Нажмите "📍 Отправить локацию"',
      Extra
        .markup(Markup.keyboard([
          [Markup.locationRequestButton('📍 Отправить локацию')]
        ]).resize().oneTime())
    )

    ctx.session.number = String(ctx.message.text || ctx.message.contact.phone_number).replace("+", "")
    return ctx.wizard.next()
  },
  (ctx) => {
    if (!ctx.message.location) {
      return ctx.reply(
        'Нажмите "📍 Отправить локацию"',
        Extra
          .markup(Markup.keyboard([
            [Markup.locationRequestButton('📍 Отправить локацию')]
          ]).resize().oneTime())
      )
    }

    ctx.reply(
      'Пасиб',
      Extra
        .markup(Markup.removeKeyboard(true))
      )
    bot.telegram.sendMessage(
      // data.chatId, 
      `Новая анкета: \n\nИмя: ${ctx.session.name} \nНомер: ${ctx.session.number}`,
      Extra
        .markup(Markup.inlineKeyboard([
          [Markup.callbackButton('📍 Получить локацию', `loc_${ctx.message.location.latitude}_${ctx.message.location.longitude}`)]
        ]))  
    )
  }
)




const bot = new Telegraf("6528186238:AAHM3EKRWGhMs3KFwCPlJrBI3pXOWyIxq10")

bot.start((ctx) => ctx.reply('Как Вас зовут?'))

bot.action(/loc_*/, (ctx) => {
  ctx.answerCbQuery()

  const latitude = ctx.update.callback_query.data.substr(4, 9)
  const longitude = ctx.update.callback_query.data.substr(14, 9)

  ctx.replyWithLocation(
    latitude, longitude,
    Extra
      .inReplyTo(ctx.update.callback_query.message.message_id)
  )
})

const stage = new Stage([superWizard], { default: 'super-wizard' })
bot.use(session())
bot.use(stage.middleware())
bot.launch()