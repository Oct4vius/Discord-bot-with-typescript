import axios from "axios";
import { Client, EmbedBuilder, TextChannel } from "discord.js";
import { shiftObjectOrder } from "../../utils/shuffle";

module.exports = async (client: Client) => {
  console.log(`I'm ready. My name is ${client.user?.tag}`);

  const channel = (await client.channels.fetch(
    "805916546224488452"
  )) as TextChannel;
  if (!channel) return;

  const response = await axios.get('https://random-list-project-default-rtdb.firebaseio.com/people.json')

  const reorder = shiftObjectOrder(response.data)
  
  let order: string = ''

  Object.keys(reorder).map((key) => {
    order += `**${+key+1}**- ${reorder[+key].name}\n\n`
  })

  const orderEMbed = new EmbedBuilder()
          .setTitle(
            `Microondas`
          )
          .setDescription(order)

  channel.send({ embeds: [orderEMbed] })

};

