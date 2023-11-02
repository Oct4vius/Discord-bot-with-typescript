
import {Client, GatewayIntentBits, IntentsBitField, Message, TextChannel, VoiceChannel} from 'discord.js';
import { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnection, PlayerSubscription, AudioPlayer } from '@discordjs/voice';
import { config } from 'dotenv';
import axios from 'axios';
import {stream} from 'play-dl'
import ytdl from 'ytdl-core';
import { send } from 'process';


config();

type bensonInteractionType = {
    imgPath: string
    message: string
    audio: string
}

const apiKey: string | undefined = process.env.API_KEY_GOOGLE;
const apiUrl: string =  "https://www.googleapis.com/youtube/v3"

let connection: VoiceConnection | undefined;
let voiceChannel: VoiceChannel;
let queue: string[] = [];
let nowPlayingUrl: string;

const youtubeSearch = async (searchTerm: string) =>{
    const url = `${apiUrl}/search?key=${apiKey}&type=video&part=snippet&q=${searchTerm}`;

    const response = await axios.get(url);

    let videoID = response.data.items[0].id.videoId;

    return `https://www.youtube.com/watch?v=${videoID}`;
}

const play = (msg: Message) =>{

    if(!connection) return;
    
    try {
    
        let nextUrl: string = queue[0];
        const player: AudioPlayer = createAudioPlayer();
        
        const resource = createAudioResource(ytdl(nextUrl, {filter: 'audioonly', quality: "highestaudio", highWaterMark: 1 << 25}))
        player.play(resource);
        connection.subscribe(player);

        queue.shift()

        connection.on("stateChange", (prevState, currState)=>{
            if(currState.status === 'destroyed'){
                connection === undefined;
                queue = []
            }
        })

        player.on("stateChange", (prevState, currState) =>{
            if(currState.status !== "playing"){

                if(queue.length === 0 && connection){
                    msg.channel.send('Se acabo')
                    connection.destroy()
                    connection = undefined
                }else{
                    play(msg)
                }
            }
        })

    } catch (error) {
        console.log(error)
    }

}

const bensonInteraction: bensonInteractionType[] = [
    {
        imgPath: "./assets/images/benson.png",
        message: "¿Como \'ta muchacho?",
        audio: "./assets/audio/cmtm.mp3"
    },
    {
        imgPath: "./assets/images/muchacho.png",
        message: "Yo te veo muy bien.",
        audio: "./assets/audio/ylvaumb.mp3"
    },
    {
        imgPath: "./assets/images/recompensa.png",
        message: "Tú te merece' una recompensa.",
        audio: "./assets/audio/recompensa.mp3"
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
    let msgSplited: string[] = msg.content.split(" ")

    //Benson Interactions
    switch(msg.content.toLowerCase()){
        case 'ctm':
            let random: number = Math.trunc(Math.random() * bensonInteraction.length);

            msg.reply({
                content: bensonInteraction[random].message,
                files: [bensonInteraction[random].imgPath]
            })
            
            if (msg.member && msg.member.voice.channel){
                if(!msg.guild) return

                const voiceChannel = msg.member.voice.channel;

                if(!connection){
                    connection = joinVoiceChannel({
                        channelId: voiceChannel.id,
                        guildId: msg.guild.id,
                        adapterCreator: msg.guild?.voiceAdapterCreator,
                    });
                }

                const player = createAudioPlayer();
                const resource = createAudioResource(bensonInteraction[random].audio)
                player.play(resource);
                connection.subscribe(player);

                player.on('error', error => {
                  console.error(`Error: ${error.message} with resource `);
                });
            }

            break;

        case 'muchacho':
            const muchacho: number = 0

            msg.reply({
                content: bensonInteraction[muchacho].message,
                files: [bensonInteraction[muchacho].imgPath]
            })
            
            if (msg.member && msg.member.voice.channel){
                if(!msg.guild) return

                const voiceChannel = msg.member.voice.channel;

                if(!connection){
                    connection = joinVoiceChannel({
                        channelId: voiceChannel.id,
                        guildId: msg.guild.id,
                        adapterCreator: msg.guild?.voiceAdapterCreator,
                    });
                }

                const player = createAudioPlayer();
                const resource = createAudioResource(bensonInteraction[muchacho].audio)
                player.play(resource);

                connection.subscribe(player);

                player.on('error', error => {
                console.error(`Error: ${error.message} with resource `);
                });
            }

            break;

        case 'bien':
            let bien: number = 1

            msg.reply({
                content: bensonInteraction[bien].message,
                files: [bensonInteraction[bien].imgPath]
            })
            
            if (msg.member && msg.member.voice.channel){
                if(!msg.guild) return

                const voiceChannel = msg.member.voice.channel;

                if(!connection){
                    connection = joinVoiceChannel({
                        channelId: voiceChannel.id,
                        guildId: msg.guild.id,
                        adapterCreator: msg.guild?.voiceAdapterCreator,
                    });
                }

                const player = createAudioPlayer();
                const resource = createAudioResource(bensonInteraction[bien].audio)
                player.play(resource);

                connection.subscribe(player);

                player.on('error', error => {
                console.error(`Error: ${error.message} with resource `);
                });
            }

            break;

        case 'recompensa':

            let recompensa: number = 2

            msg.reply({
                content: bensonInteraction[recompensa].message,
                files: [bensonInteraction[recompensa].imgPath]
            })
            
            if (msg.member && msg.member.voice.channel){
                if(!msg.guild) return

                const voiceChannel = msg.member.voice.channel;

                if(!connection){
                    connection = joinVoiceChannel({
                        channelId: voiceChannel.id,
                        guildId: msg.guild.id,
                        adapterCreator: msg.guild?.voiceAdapterCreator,
                    });
                }

                const player = createAudioPlayer();
                const resource = createAudioResource(bensonInteraction[recompensa].audio)
                player.play(resource);

                connection.subscribe(player);

                player.on("stateChange", (pevState, currState) =>{
                    if(!connection) return
                    if(currState.status === 'idle'){
                        connection.destroy()
                        connection = undefined
                    }
                })

                player.on('error', error => {
                console.error(`Error: ${error.message} with resource `);
                });
            }

            break;
        
        case 'vete':
            if(!connection) return

            connection.destroy()
            connection = undefined
            
            break;

    }

    //Music Interactions
    switch(msgSplited[0]){
        
        case 'pon':
            let voiceChannel = msg.member?.voice.channel

            if(!msg.guild) return;

            if(msgSplited.length < 2){
                msg.channel.send('Tienes que dar un parametro')
                return;
            }

            if(!voiceChannel) return

            msgSplited.shift()
            let msgJoined = msgSplited.join(" ")

            if(!ytdl.validateURL(msgJoined)){
                let url: string = await youtubeSearch(msgJoined)
                queue.push(url)

                if(connection){
                    msg.channel.send('Aguantate mmg')
                }

                if(!connection){
                    connection = joinVoiceChannel({
                        channelId: voiceChannel.id,
                        guildId: msg.guild.id,
                        adapterCreator: msg.guild?.voiceAdapterCreator,
                    });
                    play(msg);
                    
                }
            }else{
                queue.push(msgJoined)

                if(connection){
                    msg.channel.send('Aguantate mmg')
                }

                if(!connection){
                    connection = joinVoiceChannel({
                        channelId: voiceChannel.id,
                        guildId: msg.guild.id,
                        adapterCreator: msg.guild?.voiceAdapterCreator,
                    });
                    play(msg);
                }
            }

            
        
            break;
    }

    //Chatgpt Interactions

})

client.login(process.env.TOKEN)