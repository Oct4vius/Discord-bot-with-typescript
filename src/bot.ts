import {Client, GatewayIntentBits, IntentsBitField} from 'discord.js';
import { config } from 'dotenv';
config();

const myIntents = new IntentsBitField();
myIntents.add(
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
)

const client: Client = new Client( {intents: myIntents});

client.on('ready', () => {
    console.log(`I'm ready. My name is ${client.user?.tag}`)
})

client.on('messageCreate', (msg) =>{
    if(msg.content.toLowerCase() === 'hola'){
        msg.reply('¿Cómo \'tas muchacho?')
    }
})

client.login(process.env.TOKEN)