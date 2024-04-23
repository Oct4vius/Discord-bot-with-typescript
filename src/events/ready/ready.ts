import axios from "axios";
import { Client, EmbedBuilder, TextChannel } from "discord.js";
import { shiftObjectOrder } from "../../utils/shuffle";
import { MicrowaveListReponse } from "../../types/index.types";

module.exports = async (client: Client) => {
  console.log(`I'm ready. My name is ${client.user?.tag}`);

  const horas = [
    "12:50",
    "12:50",
    "12:54",
    "12:54",
    "12:58",
    "12:58",
    "01:02",
    "01:02",
    "01:06",
    "01:06",
    "01:10",
    "01:10",
    "01:14",
    "01:14",
    "01:18",
    "01:18",
  ];

  const channel = (await client.channels.fetch(
    "805916546224488452"
  )) as TextChannel;
  if (!channel) return;

  const response = await axios.get<MicrowaveListReponse[]>(
    "https://random-list-project-default-rtdb.firebaseio.com/people.json"
  );

  const reorder = shiftObjectOrder(response.data);

  let order: string = "";

  Object.keys(reorder).map((key, index) => {
    order += `**${+key + 1}**- ${reorder[+key].name} 🕐 **${horas[index]}** \n\n`;
  });

  const orderEmbed = new EmbedBuilder()
    .setTitle(`Microondas`)
    .setDescription(order);

  channel.send({ embeds: [orderEmbed] });
};
