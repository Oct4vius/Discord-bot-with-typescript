"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const voice_1 = require("@discordjs/voice");
const dotenv_1 = require("dotenv");
const axios_1 = __importDefault(require("axios"));
const ytdl_core_1 = __importDefault(require("ytdl-core"));
(0, dotenv_1.config)();
const apiKey = process.env.API_KEY_GOOGLE;
const apiUrl = "https://www.googleapis.com/youtube/v3";
let connection;
let voiceMusicChannel;
let textMusicChannel;
let queue = [];
let nowPlayingUrl;
const youtubeSearch = (searchTerm) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${apiUrl}/search?key=${apiKey}&type=video&part=snippet&q=${searchTerm}`;
    try {
        const response = yield axios_1.default.get(url);
        let videoID = response.data.items[0].id.videoId;
        return `https://www.youtube.com/watch?v=${videoID}`;
    }
    catch (error) {
        console.log(error);
    }
});
const play = (bensonAudio) => {
    if (!connection)
        return;
    try {
        let nextUrl = queue[0];
        const player = (0, voice_1.createAudioPlayer)();
        const resource = (0, voice_1.createAudioResource)(bensonAudio ? bensonAudio : (0, ytdl_core_1.default)(nextUrl, { filter: 'audioonly', quality: "highestaudio", highWaterMark: 1 << 25 }));
        player.play(resource);
        connection.subscribe(player);
        queue.shift();
        connection.on("stateChange", (prevState, currState) => {
            if (currState.status === 'destroyed') {
                connection === undefined;
                queue = [];
            }
        });
        player.on("stateChange", (prevState, currState) => {
            if (bensonAudio) {
                return;
            }
            ;
            if (currState.status !== "playing") {
                if (queue.length === 0 && connection && !bensonAudio) {
                    // textMusicChannel.send('Se acabo')
                    connection.destroy();
                    connection = undefined;
                }
                else {
                    play();
                }
            }
        });
        player.on('error', (error) => {
            console.log(error);
        });
    }
    catch (error) {
        console.log(error);
    }
};
const bensonInteraction = [
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
];
const myIntents = new discord_js_1.IntentsBitField();
myIntents.add(discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMessages, discord_js_1.GatewayIntentBits.MessageContent, discord_js_1.GatewayIntentBits.GuildMembers);
const client = new discord_js_1.Client({ intents: 3276799 });
client.on('ready', () => {
    var _a;
    console.log(`I'm ready. My name is ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}`);
});
client.on('messageCreate', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    if (msg.author.bot)
        return;
    let msgSplited = msg.content.split(" ");
    //Benson Interactions
    switch (msg.content.toLowerCase()) {
        case 'ctm':
            let random = Math.trunc(Math.random() * bensonInteraction.length);
            msg.reply({
                content: bensonInteraction[random].message,
                files: [bensonInteraction[random].imgPath]
            });
            if (msg.member && msg.member.voice.channel) {
                if (!msg.guild)
                    return;
                const voiceChannel = msg.member.voice.channel;
                if (!connection) {
                    connection = (0, voice_1.joinVoiceChannel)({
                        channelId: voiceChannel.id,
                        guildId: msg.guild.id,
                        adapterCreator: (_a = msg.guild) === null || _a === void 0 ? void 0 : _a.voiceAdapterCreator,
                    });
                }
                play(bensonInteraction[random].audio);
            }
            break;
        case 'muchacho':
            const muchacho = 0;
            msg.reply({
                content: bensonInteraction[muchacho].message,
                files: [bensonInteraction[muchacho].imgPath]
            });
            if (msg.member && msg.member.voice.channel) {
                if (!msg.guild)
                    return;
                const voiceChannel = msg.member.voice.channel;
                if (!connection) {
                    connection = (0, voice_1.joinVoiceChannel)({
                        channelId: voiceChannel.id,
                        guildId: msg.guild.id,
                        adapterCreator: (_b = msg.guild) === null || _b === void 0 ? void 0 : _b.voiceAdapterCreator,
                    });
                }
                const player = (0, voice_1.createAudioPlayer)();
                const resource = (0, voice_1.createAudioResource)(bensonInteraction[muchacho].audio);
                player.play(resource);
                connection.subscribe(player);
                player.on('error', error => {
                    console.error(`Error: ${error.message} with resource `);
                });
            }
            break;
        case 'bien':
            let bien = 1;
            msg.reply({
                content: bensonInteraction[bien].message,
                files: [bensonInteraction[bien].imgPath]
            });
            if (msg.member && msg.member.voice.channel) {
                if (!msg.guild)
                    return;
                const voiceChannel = msg.member.voice.channel;
                if (!connection) {
                    connection = (0, voice_1.joinVoiceChannel)({
                        channelId: voiceChannel.id,
                        guildId: msg.guild.id,
                        adapterCreator: (_c = msg.guild) === null || _c === void 0 ? void 0 : _c.voiceAdapterCreator,
                    });
                }
                const player = (0, voice_1.createAudioPlayer)();
                const resource = (0, voice_1.createAudioResource)(bensonInteraction[bien].audio);
                player.play(resource);
                connection.subscribe(player);
                player.on('error', error => {
                    console.error(`Error: ${error.message} with resource `);
                });
            }
            break;
        case 'recompensa':
            let recompensa = 2;
            msg.reply({
                content: bensonInteraction[recompensa].message,
                files: [bensonInteraction[recompensa].imgPath]
            });
            if (msg.member && msg.member.voice.channel) {
                if (!msg.guild)
                    return;
                const voiceChannel = msg.member.voice.channel;
                if (!connection) {
                    connection = (0, voice_1.joinVoiceChannel)({
                        channelId: voiceChannel.id,
                        guildId: msg.guild.id,
                        adapterCreator: (_d = msg.guild) === null || _d === void 0 ? void 0 : _d.voiceAdapterCreator,
                    });
                }
                const player = (0, voice_1.createAudioPlayer)();
                const resource = (0, voice_1.createAudioResource)(bensonInteraction[recompensa].audio);
                player.play(resource);
                connection.subscribe(player);
                player.on("stateChange", (pevState, currState) => {
                    if (!connection)
                        return;
                    if (currState.status === 'idle') {
                        connection.destroy();
                        connection = undefined;
                    }
                });
                player.on('error', error => {
                    console.error(`Error: ${error.message} with resource `);
                });
            }
            break;
        case 'vete':
            if (!connection)
                return;
            connection.destroy();
            connection = undefined;
            break;
    }
    //Music Interactions
    switch (msgSplited[0]) {
        case 'pon':
            let voiceChannel = (_e = msg.member) === null || _e === void 0 ? void 0 : _e.voice.channel;
            if (!msg.guild)
                return;
            if (msgSplited.length < 2) {
                msg.channel.send('Tienes que dar un parametro');
                return;
            }
            if (!voiceChannel)
                return;
            msgSplited.shift();
            let msgJoined = msgSplited.join(" ");
            let url = ytdl_core_1.default.validateURL(msgJoined) ? msgJoined : yield youtubeSearch(msgJoined);
            if (!url) {
                msg.reply('Hubo un problema');
                return;
            }
            queue.push(url);
            if (connection) {
                msg.channel.send('Perate');
            }
            if (!connection) {
                connection = (0, voice_1.joinVoiceChannel)({
                    channelId: voiceChannel.id,
                    guildId: msg.guild.id,
                    adapterCreator: (_f = msg.guild) === null || _f === void 0 ? void 0 : _f.voiceAdapterCreator,
                });
                textMusicChannel = msg.channel;
                play();
            }
            break;
    }
    //Chatgpt Interactions
}));
client.login(process.env.TOKEN);
