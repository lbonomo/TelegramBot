import { addQuote } from './dynamo'

const main = async () => {
    let url ="https://api.quotable.io/random"

    // https://dummyjson.com/quotes/1
    // https://zenquotes.io/api/quotes
    // https://type.fit/api/quotes

    let raw = await fetch(url)
    let quotable = await raw.json();
    let user_id = '417008159'

    let result = await addQuote(user_id, quotable.content, quotable.author)
    if ( result ) {
        console.log("Quote added!")
    } 
}

main()