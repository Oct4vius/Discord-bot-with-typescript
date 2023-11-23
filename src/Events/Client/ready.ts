import {Client} from 'discord.js'

module.exports = {
    name: 'ready',
    once: true,
    execute(client: Client) {

        console.log(`I'm ready. My name is ${client.user?.tag}`)

    }
}