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

    const command = new PutItemCommand({
        TableName: "TelegramUsers",
        Item: {
            chatID: { N:  context.chat.id.toString() },
            username: { S: context.from.username },
            userID: { N: context.from.id.toString() },
            first_name: { S: context.from.first_name },
            last_name: { S: context.from.last_name }
        },
    });

    const data = await client.send(command);
    console.log(data);
}


const bot = new Telegraf(process.env.BOT_TOKEN as string)

const quote =async () => {
    return "some quote";
}

bot.command('quote', async (context:any) => {
    await addUser(context)
    context.reply( await quote(),  {parse_mode: 'HTML'}) 
})

bot.start((context) => context.reply('Comandos soportados: /quote'))

// Inicia el bot.
bot.launch()


