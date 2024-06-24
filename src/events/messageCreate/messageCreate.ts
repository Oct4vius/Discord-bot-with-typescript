import { Client, EmbedBuilder, Message } from "discord.js";
import { createReadStream } from "fs";
import axios from "axios";
import playdl from "play-dl";
import {
  bensonInteractionType,
  fieldsType,
  MicrowaveListReponse,
  queueType,
  servers,
} from "../../types/index.types";
import {
  CreateVoiceConnectionOptions,
  JoinVoiceChannelOptions,
  VoiceConnection,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from "@discordjs/voice";
import { handleReset } from "../../utils/shuffle";

const apiKey: string | undefined = process.env.API_KEY_GOOGLE;
const apiUrl: string = "https://www.googleapis.com/youtube/v3";

let servers: servers = {};

const youtubeSearch = async (
  searchTerm: string
): Promise<queueType | undefined> => {
  const url = `${apiUrl}/search?key=${apiKey}&type=video&part=snippet&q=${searchTerm}`;

  try {
    const response = await axios.get(url);

    const video = response.data.items[0];

    let videoID = video.id.videoId;

    const youtubeSearch: queueType = {
      url: `https://www.youtube.com/watch?v=${videoID}`,
      thumbnail: video.snippet.thumbnails.high.url,
      title: video.snippet.title,
      author: video.snippet.channelTitle,
    };

    return youtubeSearch;
  } catch (error) {
    console.log(error);
  }
};

const newPlay = async (
  msg: Message,
  connection: VoiceConnection,
  bensonAudio?: string
) => {
  if (!msg.guild) return;
  if (!msg.member || !msg.member.voice.channel) return;

  let server = servers[msg.guild.id];

  const stream = !bensonAudio
    ? await playdl.stream(server.queue[0].url!)
    : undefined;

  const resource = createAudioResource(
    bensonAudio ? createReadStream(bensonAudio) : stream ? stream.stream : "",
    {
      inputType: stream ? stream.type : undefined,
    }
  );

  let player = createAudioPlayer();
  player.play(resource);

  server.dipatcher = connection.subscribe(player);

  server.nowPlaying = server.queue.shift();

  if (
    server.nowPlaying &&
    server.nowPlaying.title &&
    server.nowPlaying.thumbnail &&
    server.nowPlaying.author &&
    msg
  ) {
    const nPlaying = new EmbedBuilder()
      .setTitle(server.nowPlaying.title)
      .setDescription(server.nowPlaying.author)
      .setURL(server.nowPlaying.url!)
      .setImage(server.nowPlaying.thumbnail)
      .setAuthor({
        iconURL:
        msg.member?.user.avatarURL() || `https://i.imgur.com/AfFp7pu.png`,
        name:
        msg.member?.user.username ||
          `Este tiguere no tiene nombre que diablo`,
      });
      msg.channel.send({ embeds: [nPlaying] });
  }

  if (!server.dipatcher) return;

  server.dipatcher.player.on("stateChange", (_, currState) => {

    if (currState.status === "idle") {
      if (server.queue.length === 0) {
        connection.destroy();
        server.queue = [];
      } else if (server.queue.length > 0) {
        newPlay(msg, connection);
      }
    }
  });
};

const bensonInteraction: bensonInteractionType[] = [
  {
    imgPath: "./assets/images/benson.png",
    message: "¿Como 'ta muchacho?",
    audio: "./assets/audio/cmtm.mp3",
  },
  {
    imgPath: "./assets/images/muchacho.png",
    message: "Yo te veo muy bien.",
    audio: "./assets/audio/ylvaumb.mp3",
  },
  {
    imgPath: "./assets/images/recompensa.png",
    message: "Tú te merece' una recompensa.",
    audio: "./assets/audio/recompensa.mp3",
  },
];

module.exports = async (_: Client, msg: Message) => {
  if (msg.author.bot) return;
  if (!msg.guild) return;

  let guildId = msg.guild.id;
  let msgSplited: string[] = msg.content.split(" ");

  let VoiceConnectionProps: CreateVoiceConnectionOptions &
    JoinVoiceChannelOptions = {
    guildId: guildId,
    channelId: msg.member?.voice.channel?.id || "",
    adapterCreator: msg.guild.voiceAdapterCreator,
  };

  if (!servers[guildId])
    servers[guildId] = {
      queue: [],
    };


  if(msg.content === "/MRrifa"){
    const {data} = await axios.get<MicrowaveListReponse[]>(
      "https://random-list-project-default-rtdb.firebaseio.com/people.json"
    );

    const randomIndex = Math.floor(Math.random() * data.length);

    setTimeout(() => {
      msg.channel.send({
        content: `**${data[randomIndex].name}** se gano la recompensa.`, 
        files: [bensonInteraction[0].imgPath]
      });
    }, 5000);


    console.log(data[randomIndex].name);
  }

  //   Benson Interactions
  switch (msg.content.toLowerCase()) {
    case "ctm":
      let random: number = Math.trunc(Math.random() * bensonInteraction.length);

      msg.reply({
        content: bensonInteraction[random].message,
        files: [bensonInteraction[random].imgPath],
      });

      if (msg.member && msg.member.voice.channel) {
        if (!msg.guild) return;

        let connection = joinVoiceChannel(VoiceConnectionProps);

        newPlay(msg, connection, bensonInteraction[random].audio);
      }

      return;

    case "muchacho":
      const muchacho: number = 0;

      msg.reply({
        content: bensonInteraction[muchacho].message,
        files: [bensonInteraction[muchacho].imgPath],
      });

      if (msg.member && msg.member.voice.channel) {
        if (!msg.guild) return;

        let connection = joinVoiceChannel(VoiceConnectionProps);

        newPlay(msg, connection, bensonInteraction[muchacho].audio);
      }

      return;

    case "bien":
      let bien: number = 1;

      msg.reply({
        content: bensonInteraction[bien].message,
        files: [bensonInteraction[bien].imgPath],
      });

      if (msg.member && msg.member.voice.channel) {
        if (!msg.guild) return;

        let connection = joinVoiceChannel(VoiceConnectionProps);

        newPlay(msg, connection, bensonInteraction[bien].audio);
      }

      return;

    case "recompensa":
      let recompensa: number = 2;

      msg.reply({
        content: bensonInteraction[recompensa].message,
        files: [bensonInteraction[recompensa].imgPath],
      });

      if (msg.member && msg.member.voice.channel) {
        if (!msg.guild) return;

        let connection = joinVoiceChannel(VoiceConnectionProps);

        newPlay(msg, connection, bensonInteraction[recompensa].audio);
      }

      return;

    case "reset/microwave/shuffle":
      console.log(await handleReset())
  }

  //Music Interactions
  let server = servers[guildId];
  switch (msgSplited[0].toLowerCase()) {
    case "pon":
      if (msgSplited.length < 2) {
        msg.channel.send("Tienes que dar un parametro");
        return;
      }

      if (!msg.member?.voice.channel?.id) {
        msg.channel.send("you have to be in a voice channel you imbecile!");
        return;
      }

      msgSplited.shift();
      let msgJoined = msgSplited.join(" ");
      let resource: queueType;

      if ((await playdl.validate(msgJoined)) === "yt_video") {
        resource = { url: msgJoined };
      } else {
        let test: queueType | undefined = await youtubeSearch(msgJoined);
        if (!test) {
          msg.channel.send(
            "Muchacho se acaban la peticiones a la api. Ven mañana para la recompensa."
          );
          return;
        }

        resource = test;
      }

      server.queue.push(resource);

      if (server.dipatcher?.player.state.status === "playing") {
        const addSongEmbed = new EmbedBuilder()
          .setTitle(
            `Te va a tene que aguanta porque hay ${server.queue.length} atra de esa`
          )
          .setDescription(
            ` ${
              resource.title ? `\`${resource.title}\`` : ""
            } \nTambién puedes saltarla usando \`skip\` `
          )
          .setAuthor({
            iconURL:
              msg.member?.user.avatarURL() || `https://i.imgur.com/AfFp7pu.png`,
            name:
              msg.member?.user.username ||
              `Este tiguere no tiene nombre que diablo`,
          })
          .setThumbnail(
            resource.thumbnail || `https://i.imgur.com/AfFp7pu.png`
          );

        msg.channel.send({ embeds: [addSongEmbed] });

        return;
      }

      let connection = joinVoiceChannel(VoiceConnectionProps);

      newPlay(msg, connection);

      break;

    case "skip":
      if (!server.dipatcher?.connection) {
        msg.channel.send("No hay na pueto wtf");
        return;
      }

      if (!msg.member?.voice.channel?.id) {
        msg.channel.send("you have to be in a voice channel you imbecile!");
        return;
      }

      if (!server.dipatcher.player) {
        msg.channel.send("No hay na pueto");
        return;
      }

      if (server.queue.length === 0) {
        msg.channel.send("Loco, no hay ma cancione en la cola");
        return;
      }

      server.dipatcher.player.stop();

      break;

    case "cola":
      if (!server.nowPlaying) return;

      let fields: fieldsType[] = server.queue.map((song, index) => {
        return {
          name:
            `${index + 1}. ` +
            (song.title ||
              `No tengo el nombre, pero aqui ta la url xd\n${song.url}`),
          value: song.author || `No tengo el autor xd`,
        };
      });

      let nowPlayingField: fieldsType = {
        name:
          `Lo que ta sonando ahora -> ` +
          (server.nowPlaying.title ||
            `No tengo el nombre, pero aqui ta la url xd\n${server.nowPlaying.url}`),
        value: server.nowPlaying.author || `No tengo el autor xd`,
      };

      fields.unshift(nowPlayingField);

      const colaEmbed = new EmbedBuilder()
        .setTitle("Esta son las vainas que tan en la cola")
        .setFields(...fields);

      msg.channel.send({ embeds: [colaEmbed] });
      break;

    case "vete":

      if (msg.member?.voice.channel?.id) {
        msg.channel.send("you have to be in a voice channel you imbecile!");
        return;
      }

      if (!server.dipatcher?.connection) return;

      server.dipatcher.connection.destroy();
      server.queue = [];

      break;

  }
};
