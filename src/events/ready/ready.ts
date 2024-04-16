import axios from "axios";
import { APIEmbedField, Client, EmbedBuilder, RestOrArray, TextChannel } from "discord.js";
import { shuffle } from "../../utils/shuffle";

module.exports = async (client: Client) => {
  console.log(`I'm ready. My name is ${client.user?.tag}`);

  const channel = (await client.channels.fetch(
    "1229834611362631713"
  )) as TextChannel;
  if (!channel) return;


  const response = await axios.get('https://random-list-project-default-rtdb.firebaseio.com/people.json')

  const reorder = shuffle(response.data)

  const order: RestOrArray<APIEmbedField> = []

  Object.keys(reorder).map((key) => {
    order.push({
        name: key,
        value: reorder[+key].name
    })
  })

  const orderEMbed = new EmbedBuilder()
          .setTitle(
            `Microondas`
          )
          .setFields(...order)

  channel.send({ embeds: [orderEMbed] })

};
