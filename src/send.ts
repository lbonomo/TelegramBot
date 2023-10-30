import { Telegram } from 'telegraf'
import 'dotenv/config'
import { ScanCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";

const bot = new Telegram(process.env.BOT_TOKEN as string)

const sendMessage = (chatID: any) => {
    bot.sendMessage(
        chatID,
        'This message was sent without your interaction!'
    );
}

const main = async () => {
    // const client = new DynamoDBClient({});
    const client = new DynamoDBClient({
        credentials: {
            accessKeyId: process.env.ACCESS_KEY_ID as string,
            secretAccessKey: process.env.SECRET_ACCESS_KEY as string,
        },
        region: "us-east-1",
    });

    const input = {
        TableName: "TelegramUsers"
    }

    const command = new ScanCommand(input)
    const response = await client.send(command)

    response.Items?.forEach(item => {
        sendMessage(item.userID.N)
    });
}

main()