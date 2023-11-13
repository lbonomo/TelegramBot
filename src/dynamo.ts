
import { PutItemCommand, GetItemCommand, DynamoDBClient, ScanCommand, QueryCommand } from "@aws-sdk/client-dynamodb"
import { v4 as uuid } from 'uuid'
import 'dotenv/config'

interface IUserData {
    user_id: { 'N': string }
    date: { 'S': string }
    last_name: { 'S': string }
    first_name: { 'S': string }
    username: { 'S': string }
    rol: { 'S': string }
    language: { 'S': string }
}


interface IQuote {
    quote_id: { 'S': string },
    date: { 'S': string },
    user_id: { 'N': string },
    status: { 'S': string },
    language: { 'S': string },
    quote: { 'S': string },
    author: { 'S': string }
}

const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID as string
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY as string

// const client = new DynamoDBClient({});
const client = new DynamoDBClient({
    credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
    },
    region: "us-east-1",
});

// User
// Add user to DynamoDB.
export const addUser = async (user_id: string, username: string, first_name: string, last_name: string, language: string) => {
    console.log(user_id)
    let date = new Date

    const command = new PutItemCommand({
        TableName: "TelegramUsers",
        Item: {
            username: { S: username },
            user_id: { N: user_id },
            first_name: { S: first_name },
            last_name: { S: last_name },
            language: { S: language },
            rol: { S: 'user' },
            date: { S: date.toISOString() }
        },
    });

    await client.send(command);
}

// https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-table-read-write.html
export const getInfo = async (user_id: string) => {
    const input = {
        "TableName": "TelegramUsers",
        "Key": {
            "user_id": {
                "N": user_id
            }
        }
    };

    const command = new GetItemCommand(input);
    const data = await client.send(command);
    let user = data.Item

    // console.log(data.Item)
    // if (data.Item) {
    // } else {
    //     return false
    // }
    return user

}

// Quote
// Add a new quote.
export const addQuote = async (user_id: string, quote: string, author: string) => {

    let quote_id = uuid()
    let date = new Date
    let user = await (getInfo(user_id))
    let status = (user?.rol?.S === 'admin') ? 'approved' : 'pending'
    let language =  ( user?.language.S != undefined ) ? user?.language.S : 'es'

    const command = new PutItemCommand({
        TableName: "Quotes",
        Item: {
            quote_id: { S: quote_id },
            user_id: { N: user_id },
            date: { S: date.toISOString() },
            quote: { S: quote },
            author: { S: author },
            language: { S: language },
            status: { S: status }
        },
    });

    let response = await client.send(command);
    // TODO: improve.
    return true
}


// Get quote.
export const getQuote = async () => {

    // Get all ID
    const commandIDs = new ScanCommand({
        "TableName": "Quotes",
        "AttributesToGet": ['quote_id']
    });
    const response = await client.send(commandIDs);
    let ids: any = []
    response.Items?.map(item => {
        ids.push(item.quote_id.S)
    })

    // Get random ID
    var id = ids[Math.floor(Math.random() * ids.length)];

    // Get Quote.
    const input = {
        "TableName": "Quotes",
        "Key": { "quote_id": { 'S': id } }
    }

    const command = new GetItemCommand(input);
    const data = await client.send(command);
    const quote = data.Item

    return quote
}

// Message
// Add message
export const addMessage = async (message_id: string, user_id: string, date: string, text: string) => {
    const command = new PutItemCommand({
        TableName: "TelegramMessages",
        Item: {
            message_id: { N: message_id },
            user_id: { N: user_id },
            date: { S: date },
            text: { S: text }
        },
    });

    await client.send(command);
}