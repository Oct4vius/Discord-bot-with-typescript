import {Client, GatewayIntentBits, IntentsBitField, Message, EmbedBuilder, embedLength, GuildChannel, TextChannel } from 'discord.js';
import { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnection, AudioPlayer } from '@discordjs/voice';
import { config } from 'dotenv';
import { createReadStream } from 'fs'
import axios from 'axios';
import ytdl from 'ytdl-core';

config();

type bensonInteractionType = {
    imgPath: string
    message: string
    audio: string
}

type queueType = {
    url: string
    thumbnail?: string
    title?: string
    author?: string
}

const apiKey: string | undefined = process.env.API_KEY_GOOGLE;
const apiUrl: string =  "https://www.googleapis.com/youtube/v3"

let connection: VoiceConnection | undefined;

let player: AudioPlayer = createAudioPlayer();
let nowPlaying: queueType;
let message: Message;
let queue: queueType[] = [];

const youtubeSearch = async (searchTerm: string): Promise<queueType | undefined > => {
    const url = `${apiUrl}/search?key=${apiKey}&type=video&part=snippet&q=${searchTerm}`;

    try {
    
        const response = await axios.get(url);

        const video = response.data.items[0]
    
        let videoID = video.id.videoId;

        const youtubeSearch: queueType = {
            url: `https://www.youtube.com/watch?v=${videoID}`,
            thumbnail: video.snippet.thumbnails.high.url,
            title: video.snippet.title,
            author: video.snippet.channelTitle
        }
    
        return youtubeSearch;
        
    } catch (error) {
        console.log(error)
    }
}

const play = (bensonAudio?: string) => {

    if(!connection) return;
    
    try {
    
        let nextUrl: string = queue[0]?.url;
        const resource = createAudioResource(bensonAudio ? createReadStream(bensonAudio) : ytdl(nextUrl, {filter: 'audioonly', quality: "highestaudio", highWaterMark: 1 << 25}))
        player.play(resource);
        connection.subscribe(player);

        nowPlaying = queue[0]

        queue.shift();

        if(nowPlaying.title && nowPlaying.thumbnail && nowPlaying.author && message){
            const nPlaying = new EmbedBuilder()
                .setTitle(nowPlaying.title)
                .setDescription(nowPlaying.author)
                .setURL(nowPlaying.url)
                .setImage(nowPlaying.thumbnail)
                .setAuthor({
                    iconURL: message.member?.user.avatarURL() || `https://i.imgur.com/AfFp7pu.png`,
                    name: message.member?.user.username || `Este tiguere no tiene nombre que diablo`
                })

            message.channel.send({embeds: [nPlaying]})
            
        }


        
        player.on("stateChange", (_, currState) =>{       
            if(!connection) return
            if(currState.status === "idle"){
                if(queue.length === 0 || bensonAudio){

                    connection.destroy()
                    connection = undefined
                    queue = []
                }else{
                    if(!bensonAudio){
                        play()
                    }
                }
            }
        })

        player.on('error', (error) => {
            console.log(error)
        })

        connection.on('error', (error) =>{
            console.log(error)
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

                play(bensonInteraction[random].audio)

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

                play(bensonInteraction[muchacho].audio)
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

                play(bensonInteraction[bien].audio)
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

                play(bensonInteraction[recompensa].audio)
            }

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
            let resource: queueType;

            
            if(ytdl.validateURL(msgJoined)){
                resource = {url: msgJoined}
            }else{
                let test: queueType | undefined = await youtubeSearch(msgJoined)
                if (!test){
                    msg.channel.send('Hubo un problema')
                    return;
                }

                resource = test;

            }

            queue.push(resource)

            if(connection){
                const addSongEmbed = new EmbedBuilder()
                .setTitle(`Te va a tene que aguanta porque hay ${queue.length} atra de esa`)
                .setDescription(`\` ${resource.title} \` \nTambién puedes saltarla usando \`skip\` `)
                .setAuthor({
                    iconURL: msg.member?.user.avatarURL() || `https://i.imgur.com/AfFp7pu.png` ,
                    name: msg.member?.user.username ||  `Este tiguere no tiene nombre que diablo`
                })

                msg.channel.send({embeds: [addSongEmbed]})
            }

            if(!connection){
                connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: msg.guild.id,
                    adapterCreator: msg.guild?.voiceAdapterCreator,
                });
                message = msg
                play();

            }
            
            break;
        
        case 'skip':

            if(!connection){
                msg.channel.send("No hay na pueto wtf");
                return;
            }
            
            if(queue.length === 0){
                msg.channel.send("Loco, no hay ma cancione en la cola")
                return;
            }

            player.on("stateChange", (_, currState) =>{
                if(currState.status === 'playing'){
                }
            })

            player.stop()
            player = createAudioPlayer()

            break;

        case 'vete':
            if(!connection) return

            connection.destroy()
            connection = undefined
            
            break;

        case 'test':
            console.log(queue)

            break;
    }

    //Chatgpt Interactions

})

client.login(process.env.TOKEN)