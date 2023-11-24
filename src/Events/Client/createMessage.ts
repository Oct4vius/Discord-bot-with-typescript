import {Message} from 'discord.js'

module.exports = {
    name: "messageCreate",
    on: true,
    execute(msg: Message) {
        console.log(`hola`)
    }
}