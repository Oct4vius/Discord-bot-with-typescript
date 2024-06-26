import {Client, GatewayIntentBits, IntentsBitField, PresenceUpdateStatus, Partials, Collection } from 'discord.js';
import { config } from 'dotenv';
import { eventHandler } from './Handlers/eventHandler';
import { CustomClient } from './types/index.types';
import { commandHandler } from './Handlers/commandHandler';

config();

const myIntents = new IntentsBitField();
myIntents.add(
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
)



const client: CustomClient = new Client( {
    intents: myIntents,
    partials: [Partials.User, Partials.Message, Partials.GuildMember, Partials.ThreadMember],
    presence: {
        activities: [{name: '¿Como \'tan muchacho?'}],
        status: PresenceUpdateStatus.Online
    }
    
} );


client.commands = new Collection();

commandHandler(client);

eventHandler(client);

client.login(process.env.TOKEN)