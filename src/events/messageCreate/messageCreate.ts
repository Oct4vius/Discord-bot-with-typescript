import {Client, EmbedBuilder, Message} from 'discord.js'
import { createReadStream } from 'fs'
import axios from 'axios';
import playdl from 'play-dl';
import { bensonInteractionType, fieldsType, queueType, queueGuildsType } from '../../types/index.types';
import { AudioPlayer, VoiceConnection, createAudioPlayer, createAudioResource, joinVoiceChannel } from '@discordjs/voice';


const apiKey: string | undefined = process.env.API_KEY_GOOGLE;
const apiUrl: string =  "https://www.googleapis.com/youtube/v3"

let connection: VoiceConnection | undefined;
let player: AudioPlayer | undefined;
let nowPlaying: queueType | undefined;
let message: Message;
let queueGuilds: queueGuildsType[] = [];
let queue: queueType[] = [];


const youtubeSearch = async (searchTerm: string): Promise<queueType | undefined> => {
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

const play = async (guildId: string, bensonAudio?: string) => {

    if(!connection) return;

    try {

    
        let nextUrl: string = queue[0]?.url || '';
        
        const stream = !bensonAudio ? await playdl.stream(nextUrl) : undefined;

        const resource = createAudioResource(bensonAudio ? createReadStream(bensonAudio) : (stream ? stream.stream : '') , {
            inputType: stream ? stream.type : undefined
        })

        player = createAudioPlayer()
        player.play(resource);
        connection.subscribe(player);

        nowPlaying = queue.shift();

        if(nowPlaying && nowPlaying.title && nowPlaying.thumbnail && nowPlaying.author && message){
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

        player.on("stateChange", (prevState, currState) =>{       
            if(!connection) return

            if(prevState.status === 'playing' && currState.status === "idle"){
                if(queue.length === 0 || bensonAudio){

                    connection.destroy()
                    connection = undefined
                    player = undefined
                    queue = []
                }else if(queue.length > 0 || !bensonAudio){
                    play(guildId);
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


module.exports = async (_: Client, msg: Message) => {
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
    switch(msgSplited[0].toLowerCase()){
        
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

            
            if(await playdl.validate(msgJoined) === 'yt_video'){
                resource = {url: msgJoined}
            }else{
                let test: queueType | undefined = await youtubeSearch(msgJoined)
                if (!test){
                    msg.channel.send('Muchacho se acaban la peticiones a la api. Ven mañana para la recompensa.')
                    return;
                }

                resource = test;
            }
            

            const existsQueue = queueGuilds.find((element) => element.guildId === msg.guild?.id)
            let queueGuildIndex = queueGuilds.findIndex((element) => element.guildId === msg.guild?.id)

            if(!existsQueue){
                queueGuilds.push({
                    guildId: msg.guild.id,
                    queue: [resource]
                })
            } else if (existsQueue){
                queueGuilds[queueGuildIndex].queue = [
                    ...queueGuilds[queueGuildIndex].queue,
                    resource
                ]
            }

            console.log(queueGuilds)

            if(connection){
                const addSongEmbed = new EmbedBuilder()
                .setTitle(`Te va a tene que aguanta porque hay ${queueGuilds[queueGuildIndex].queue.length} atra de esa`)
                .setDescription(` ${resource.title ? `\`${resource.title}\`` : ""} \nTambién puedes saltarla usando \`skip\` `)
                .setAuthor({
                    iconURL: msg.member?.user.avatarURL() || `https://i.imgur.com/AfFp7pu.png` ,
                    name: msg.member?.user.username ||  `Este tiguere no tiene nombre que diablo`
                })
                .setThumbnail(resource.thumbnail || `https://i.imgur.com/AfFp7pu.png`)

                msg.channel.send({embeds: [addSongEmbed]})
            }

            if(!connection){
                connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: msg.guild.id,
                    adapterCreator: msg.guild?.voiceAdapterCreator,
                });
                message = msg
                play(msg.guild.id);
            }
            
            break;
        
        case 'skip':

            let skipQueueGuildIndex = queueGuilds.findIndex((element) => element.guildId === msg.guild?.id)

            if(!connection){
                msg.channel.send("No hay na pueto wtf");
                return;
            }

            if(!player){
                msg.channel.send('No hay na pueto');
                return;
            }
            
            if(skipQueueGuildIndex === -1){
                message.channel.send('Algo salio mal :(')
                return;
            }

            player.stop()

            break;
        
        case 'cola':

            if(!nowPlaying) return

            const colaQueueGuildIndex = queueGuilds.findIndex((element) => element.guildId === message.guild?.id)


            let fields: fieldsType[] = queueGuilds[colaQueueGuildIndex].queue.map((song, index) => {
                return {
                    name: `${index + 1}. ` + (song.title || `No tengo el nombre, pero aqui ta la url xd\n${song.url}`), 
                    value: song.author || `No tengo el autor xd`
                }
            })

            let nowPlayingField: fieldsType = {
                name: `Lo que ta sonando ahora -> ` + (nowPlaying?.title || `No tengo el nombre, pero aqui ta la url xd\n${nowPlaying.url}`),
                value: nowPlaying.author || `No tengo el autor xd`
            }

            fields.unshift(nowPlayingField)

            const colaEmbed = new EmbedBuilder()
                .setTitle('Esta son las vainas que tan en la cola')
                .setFields(...fields)

            msg.channel.send({embeds: [colaEmbed]})
            break;

        case 'vete':
            if(!connection) return

            let leaveQueueGuildIndex = queueGuilds.findIndex((element) => element.guildId === msg.guild?.id)

            connection.destroy()
            connection = undefined;
            player = undefined
            queueGuilds[leaveQueueGuildIndex].queue = []
            
            break;

        case 'test':
            console.log(queueGuilds[0].queue)
            console.log(queueGuilds[0].queue.length)

            if(!msg.member?.voice.channel) return msg.reply('no')
            if(!msg.guild) return;
            
            const hola = joinVoiceChannel({
                channelId: msg.member?.voice.channel.id,
                guildId: msg.guild.id,
                adapterCreator: msg.guild?.voiceAdapterCreator,
            });

            break;
    }

}