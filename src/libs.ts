// Auxiliary funcition file.
import { addUser, getInfo, addQuote, addMessage } from './dynamo'

const helpES = () => {
    let text = `<b>Ayuda</b>
Se pueden ejecutar los siguientes comandos:
<code>/help</code>: Imprime este texto, en el idioma del usuario
<code>/quote</code>: Muestra una sita al azar de la base de datos.
<code>/info</code>: Muestra información sobre el usuairo y loas citas
<code>/add</code>: Ejecuta una asistente para agregar una nueva sita a la base de datos
`
    return text
}

// Add user to DynamoDB
export const adduser = (context:any) => {
    let user_id = context.from.id.toString()
    let username = context.from.username
    let first_name = context.from.first_name ? context.from.first_name : ''
    let last_name = context.from.last_name ? context.from.last_name : ''
    let language = context.from.language_code ? context.from.language_code : 'en'
    
    // Save on DynamoDB.
    addUser(user_id, username, first_name, last_name, language)
}

// Return a help.
export const help = (context:any) => {
    let es = helpES()
    let en = helpES()

    switch (context.from.language_code) {
        case "es":
            return es
        case "en":
            return en
        default:
            return en
    }

}


// Return a random quote.
export const quote = async (context: any) => {
    // Get user.
    let user = context.from.first_name

    // Get quote.

    return `Hi <strong>${user}</strong>`
}

// Return user and quote information.
export const info = async (context:any) => {
    let user_id = context.from.id.toString()
    let info:any = await( getInfo(user_id) )
    let html = `<b>Uer info:</b><code>
Username: ${info?.username?.S }
ID:       ${info?.user_id?.N }
Rol:      ${info?.rol?.S}
Language: ${info?.language?.S}
</code>`
    return html
}


// export const add = async (context:any, bot:any) => {
//     context.reply("Insert BTC Wallet Address for the payment: ");
//     bot.on("text", async (context:any) => {
//          await context.telegram
//              .sendMessage(context.message.chat.id, context.message.chat)
//              .then(() => {
//                   context.reply(`Your wallet address is: {context.update.message.text}`)
//               });
//     });
// }
