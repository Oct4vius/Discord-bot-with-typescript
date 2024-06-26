import { Interaction, SlashCommandBuilder } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("MRrifa")
        .setDescription("Pick a random Media Revolution slave to win a prize!"),

    async execute(interaction: any) {

        await interaction.channel?.send(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`)
    }
}