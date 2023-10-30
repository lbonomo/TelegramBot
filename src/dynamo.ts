
import { PutItemCommand, GetItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";

export interface IUserData {
    userID: { 'N': string }
    date:   { 'S': string }
    last_name:  { 'S': string }
    first_name: { 'S': string }
    username: { 'S': string }
    rol: { 'S': string }
    language: { 'S': string }

    // date: { S: '2023-10-29T20:20:30.409Z' },
    // last_name: { S: 'Bonomo' },
    // userID: { N: '250829747' },
    // first_name: { S: 'Lucas' },
    // username: { S: 'lbonomo' },
    // rol: { S: 'user' },
    // language: { S: 'es' }

      
}

// const client = new DynamoDBClient({});
const client = new DynamoDBClient({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID as string,
        secretAccessKey: process.env.SECRET_ACCESS_KEY as string,
    },
    region: "us-east-1",
});

// Add user to DynamoDB.
export const addUser = async (context: any) => {
    let chatID = context.chat.id.toString()
    let userID = context.from.id.toString()
    let username = context.from.username
    let first_name = context.from.first_name ? context.from.first_name : ''
    let last_name = context.from.last_name ? context.from.last_name : ''
    let language = context.from.language_code ? context.from.language_code : 'en'
    let date = new Date

    const command = new PutItemCommand({
        TableName: "TelegramUsers",
        Item: {
            username: {S: username},
            userID: {N: userID},
            first_name: {S: first_name},
            last_name: {S: last_name},
            language: {S: language},
            rol: {S: 'user'},
            date: {S: date.toISOString()}
        },
    });

    await client.send(command);
}

// Get info.
// https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-table-read-write.html
export const getInfo = async (userID: string) => {
    // let userID = context.from.id.toString()
    // console.log(userID)
    
    const input = {
        "TableName": "TelegramUsers",
        "Key": {
          "userID": {
            "N": userID
          }
        }
      };
    
    const command = new GetItemCommand(input);
    const data = await client.send(command);

    // console.log(data.Item)
    if ( data.Item ) {
        let user = data.Item
        return user
    } else {
        return false
    }
    
}

// Add a new quote.
export const addQuote = async (userID:string, quote:string, author:string) => {
    return userID
}

export const addMessage = async (message_id:string, user_id:string, date:string, text:string) => {
    const command = new PutItemCommand({
        TableName: "TelegramMessages",
        Item: {
            message_id: {N: message_id},
            user_id: {N: user_id},
            date: {S: date},
            text: {S: text}
        },
    });

    await client.send(command);
}