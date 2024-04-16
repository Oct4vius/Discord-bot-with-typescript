import { PlayerSubscription } from "@discordjs/voice";

export type servers = {
  [severId: string]: serverProp;
};

export type serverProp = {
  queue: queueType[];
  dipatcher?: PlayerSubscription;
  nowPlaying?: queueType;
};

export type bensonInteractionType = {
  imgPath: string;
  message: string;
  audio: string;
};

export type queueType = {
  url: string;
  thumbnail?: string;
  title?: string;
  author?: string;
};

export type fieldsType = {
  name: string;
  value: string;
};

export type queueGuildsType = {
  guildId: string;
  queue: queueType[];
};

export interface IShufflerResult {
  [key: number]: IPerson;
}

export interface IPerson {
  name: string;
  points: number;
}

export interface ShuffleResponse {
    count: number;
    name:  string;
}
