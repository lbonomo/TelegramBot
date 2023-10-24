import { Telegraf } from 'telegraf'
import 'dotenv/config'
import { PutItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { v4 as uuid } from 'uuid';

// const client = new DynamoDBClient({});
const client = new DynamoDBClient({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID as string,
        secretAccessKey: process.env.SECRET_ACCESS_KEY as string,
    },
    region: "us-east-1",
});

const addUser = async (context: any) => {

    let chatID     = context.chat.id.toString()
    let userID     = context.from.id.toString()
    let username   = context.from.username
    let first_name = context.from.first_name ? context.from.first_name : ''
    let last_name  = context.from.last_name ? context.from.last_name : ''
    let language   = context.from.language_code ? context.from.language_code : 'en'
    let date       = new Date

    const command = new PutItemCommand({
        TableName: "TelegramUsers",     
        Item: {
            chatID: { N: chatID },
            username: { S: username },
            userID: { N: userID },
            first_name: { S: first_name },
            last_name: { S: last_name },
            language: { S: language },
            date: { S: date.toISOString() }
        },
    });

    const data = await client.send(command);
}


const bot = new Telegraf(process.env.BOT_TOKEN as string)

const quote = async () => {
    return "some quote";
}

bot.command('quote', async (context: any) => {
    await addUser(context)
    context.reply(await quote(), { parse_mode: 'HTML' })
})

// bot.command('data', async (ctx:any) => {
//     let email;
//     let password;

//     //Something like this
//     ctx.reply("Enter your email");
//     email = await ctx.message?.text;

//     ctx.reply("Enter your password");
//     password = await ctx.message?.text;

//     console.log(email)
//     console.log(password)
// });

bot.telegram.setMyCommands([
    {
        command: 'quote',
        description: 'Write quote',
    },
    {
        command: 'greetings',
        description: 'Greetings command',
    }
]);


bot.hears(/^\/data$/, (ctx) => {
    console.log(ctx)
    // ctx.match[1] - username
    // ctx.match[2] - password
})

bot.start( (context) => {
    addUser(context)
    context.reply('Hello ' + context.from.first_name + '!')
} 

)

bot.on('text', (ctx) => {
    console.log(ctx.message.text)
    ctx.reply(
        'You choose the ' +
        (ctx.message.text === 'first' ? 'First' : 'Second') +
        ' Option!'
    );
});

bot.help((ctx) => {
    ctx.reply('Send /start to receive a greeting');
    ctx.reply('Send /keyboard to receive a message with a keyboard');
    ctx.reply('Send /quit to stop the bot');
});





// Inicia el bot.
bot.launch()