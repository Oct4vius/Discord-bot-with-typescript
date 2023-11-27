import {Client} from 'discord.js'

module.exports = (client: Client) => {
    console.log(`I'm ready. My name is ${client.user?.tag}`)
  
}