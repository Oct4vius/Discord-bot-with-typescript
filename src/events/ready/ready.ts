import axios from "axios";
import { Client, EmbedBuilder, TextChannel } from "discord.js";
import { shiftObjectOrder } from "../../utils/shuffle";
import { MicrowaveListReponse } from "../../types/index.types";
import cron from 'node-cron';





module.exports = async (client: Client) => {
  console.log(`I'm ready. My name is ${client.user?.tag}`);
  


  // cron.schedule('30 12 * * 1-5', async () => {

    let hora = '12:50'

    const channel = (await client.channels.fetch(
      "805916546224488452"
    )) as TextChannel;
    if (!channel) return;
  
    const response = await axios.get<MicrowaveListReponse[]>(
      "https://random-list-project-default-rtdb.firebaseio.com/people.json"
    );

    const reorder = shiftObjectOrder(response.data);
  
    let embedDescription: string = "";
  
    Object.keys(reorder).map((key, index) => {
      embedDescription += `**${+key + 1}**- ${reorder[+key].name} 🕐 **${hora}** \n\n`;
      if((index + 1) % 2 === 0 && index !== 0) {
        hora = sumarMinutosAHora(hora, 4)
      }
    });
  
    const orderEmbed = new EmbedBuilder()
      .setTitle(`Microondas`)
      .setDescription(embedDescription);
  
    await channel.send({ embeds: [orderEmbed] });

  // })


};

const sumarMinutosAHora = (hora: string, minutosASumar: number): string => {
  const [horas, minutos] = hora.split(':').map(Number);
  const horaDate = new Date();
  horaDate.setHours(horas);
  horaDate.setMinutes(minutos + minutosASumar);

  const nuevaHora = horaDate.getHours();
  const nuevosMinutos = horaDate.getMinutes();

  // Ajustar el formato a 'HH:mm'
  const horaFormateada = `${nuevaHora < 10 ? '0' + nuevaHora : nuevaHora}:${nuevosMinutos < 10 ? '0' + nuevosMinutos : nuevosMinutos}`;

  return horaFormateada;
}