import {Client, GatewayIntentBits, IntentsBitField, PresenceUpdateStatus, Partials } from 'discord.js';
import { config } from 'dotenv';
import { eventHandler } from './Handlers/eventHandler';
import { channel } from 'diagnostics_channel';

config();

const myIntents = new IntentsBitField();
myIntents.add(
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
)

const client: Client = new Client( {
    intents: myIntents,
    partials: [Partials.User, Partials.Message, Partials.GuildMember, Partials.ThreadMember],
    presence: {
        activities: [{name: '¿Como \'tan muchacho?'}],
        status: PresenceUpdateStatus.Online
    }
    
} );



eventHandler(client);

client.login(process.env.TOKEN)