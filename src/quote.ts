import { getQuote } from './dynamo'

const main = async () => {
    let result = await getQuote()
    console.log(`"${result?.quote.S}"`)
    console.log(`By: ${result?.author.S}`)
}

main()