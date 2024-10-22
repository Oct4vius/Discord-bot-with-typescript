import { Client, EmbedBuilder, Message } from "discord.js";
import { fieldsType, queueType } from "../../types/index.types";
import {
  CreateVoiceConnectionOptions,
  JoinVoiceChannelOptions,
  joinVoiceChannel,
} from "@discordjs/voice";
import ytdl from "@distube/ytdl-core";
import { youtubeSearch } from "../../utils/youtubeSearch";
import { bensonInteraction } from "../../utils/benson-interactions";
import { play, servers } from "../../utils/play";

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

        play(msg, connection, bensonInteraction[random].audio);
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

        play(msg, connection, bensonInteraction[muchacho].audio);
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

        play(msg, connection, bensonInteraction[bien].audio);
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

        play(msg, connection, bensonInteraction[recompensa].audio);
      }

      return;
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

      if (ytdl.validateURL(msgJoined)) {
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

      play(msg, connection);

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
      if (!msg.member?.voice.channel?.id) {
        msg.channel.send("you have to be in a voice channel you imbecile!");
        return;
      }

      if (!server.dipatcher?.connection) {
        msg.channel.send("Tu eres autista? No toy en ningun canal.");
        return;
      }

      if (
        server.dipatcher?.connection.joinConfig.channelId !==
        msg.member?.voice.channel?.id
      ) {
        msg.channel.send("Tu no ta en el canal que me tan usando. Ponte claro");
        return;
      }

      server.dipatcher.connection.destroy();
      server.queue = [];

      msg.channel.send("Me fui mmgvso");
      break;
  }
};
