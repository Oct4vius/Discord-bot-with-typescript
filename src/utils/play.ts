import { VoiceConnection, createAudioResource, StreamType, createAudioPlayer } from "@discordjs/voice";
import ytdl from "@distube/ytdl-core";
import { Message, EmbedBuilder } from "discord.js";
import { createReadStream } from "fs";
import { ServersTypes } from "../types/index.types";

export let servers: ServersTypes = {};

export const play = async (
    msg: Message,
    connection: VoiceConnection,
    bensonAudio?: string
  ) => {
    try {
      if (!msg.guild) return;
      if (!msg.member || !msg.member.voice.channel) return;
  
      let server = servers[msg.guild.id];
  
      const stream = !bensonAudio
        ? ytdl(server.queue[0].url!, { filter: "audioonly" })
        : undefined;
  
      const resource = createAudioResource(
        bensonAudio ? createReadStream(bensonAudio) : stream!,
        {
          inputType: stream ? StreamType.Arbitrary : undefined,
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
        const actionStatus = {
          idle: () => {
            if (server.queue.length === 0) {
              connection.destroy();
              server.queue = [];
            } else if (server.queue.length > 0) {
              play(msg, connection);
            }
          },
          autopaused: () => {
            connection.destroy();
            server.queue = [];
          },
        };
  
        actionStatus[currState.status as keyof typeof actionStatus]?.();
      });
    } catch (error) {
      msg.channel.send("Paso algo horrible D:");
    }
  };