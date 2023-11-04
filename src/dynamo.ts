
import { PutItemCommand, GetItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { v4 as uuid } from 'uuid';


export interface IUserData {
    user_id: { 'N': string }
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
export const addUser = async (user_id:string, username:string, first_name:string, last_name:string, language:string) => {
    console.log(user_id)
    let date = new Date

    const command = new PutItemCommand({
        TableName: "TelegramUsers",
        Item: {
            username: {S: username},
            user_id: {N: user_id},
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

    // console.log(data.Item)
    if ( data.Item ) {
        let user = data.Item
        return user
    } else {
        return false
    }
    
}

// Add a new quote.
export const addQuote = async (user_id:string, date:string, quote:string, author:string, language:string) => {
    let quote_id = uuid.toString()
    const command = new PutItemCommand({
        TableName: "Quotes",
        Item: {
            quote_id: {S: quote_id },
            user_id: {N: user_id},
            date: {S: date},
            quote: {S: quote},
            author: {S: author},
            language: {S: language}
        },
    });

    await client.send(command);
    return user_id
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