
import {Client, GatewayIntentBits, IntentsBitField, Message} from 'discord.js';
import { joinVoiceChannel, createAudioPlayer, createAudioResource } from '@discordjs/voice';
import { config } from 'dotenv';
config();

type bensonInteractionType = {
    imgPath: string
    message: string
    audio: string
}

const bensonInteraction: bensonInteractionType[] = [
    {
        imgPath: "./assets/images/benson.png",
        message: '¿Como \'ta muchacho?',
        audio: './assets/audio/cmtm.mp3'
    },
    {
        imgPath: "./assets/images/muchacho.png",
        message: 'Yo te veo muy bien',
        audio: './assets/audio/ylvaumb.mp3'
    }
]

const myIntents = new IntentsBitField();
myIntents.add(
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
)

const client: Client = new Client( {intents: 3276799} );

client.on('ready', () => {
    console.log(`I'm ready. My name is ${client.user?.tag}`)
})

client.on('messageCreate', async (msg: Message) =>{
    if(msg.author.bot) return;

    switch(msg.content.toLowerCase()){
        case 'ctm':
            let random: number = Math.trunc(Math.random() * bensonInteraction.length);

            msg.reply({
                content: bensonInteraction[random].message,
                files: [bensonInteraction[random].imgPath]
            })
            
            if (msg.member && msg.member.voice.channel){
                const voiceChannel = msg.member.voice.channel;
                if(!msg.guild) return

                const connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: msg.guild.id,
                    adapterCreator: msg.guild?.voiceAdapterCreator,
                });

                const player = createAudioPlayer();
                const resource = createAudioResource(bensonInteraction[random].audio)
                player.play(resource);

                connection.subscribe(player);

                player.on('error', error => {
                  console.error(`Error: ${error.message} with resource `);
                });
            }

            break;

        case 'vete':
            
            
            break;

    }
})


client.login(process.env.TOKEN)