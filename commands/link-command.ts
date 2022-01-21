import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';
import { API_KEY } from '../config';
import accountLinksModel from '../models/account-links-model';
import { ICommand } from '../typings';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('link')
    .setDescription('Links a minecraft account to your discord account')
    .addStringOption(option => {
      return option.setName('name')
        .setDescription('The name of the minecraft account')
        .setRequired(true);
    }),

  type: 'GUILD',

  listeners: {
    onExecute: async ({ interaction, user, args }) => {
      await interaction.deferReply({ ephemeral: true });

      const mojangData = await fetch(`https://api.mojang.com/users/profiles/minecraft/${args.getString('name')}`);

      if (mojangData.status === 204) {
        await interaction.editReply(`The player ${args.getString('name')} was not found`);

        return;
      }

      const mojangJSON = await mojangData.json();

      const hypixelData = await fetch(`https://api.hypixel.net/player?uuid=${mojangJSON.id}&key=${API_KEY}`);
      const hypixelJSON = await hypixelData.json();

      if (!hypixelJSON.success) {
        const errorEmbed = new MessageEmbed()
          .setTitle('Error')
          .setDescription(`Code: **${hypixelData.status}**\nReason: ${hypixelJSON.cause}`)
          .setColor('RED');

        await interaction.editReply({ embeds: [errorEmbed] });

        return;
      }

      if (!hypixelJSON.player) {
        await interaction.editReply('This player has never joined hypixel');

        return;
      }

      if (hypixelJSON.player.socialMedia.links.DISCORD !== user.tag) {
        await interaction.editReply('Your discord account is not linked with your hypixel account!');

        return;
      }

      await accountLinksModel.model.updateOne({ discord_id: user.id }, {
        discord_id: user.id,
        minecraft_uuid: mojangJSON.id,
      }, { upsert: true });

      const embed = new MessageEmbed()
        .setTitle('Success!')
        .setDescription(`Successfully linked your discord account with the minecraft account ${mojangJSON.name}`)
        .setTimestamp()
        .setColor('GREEN');

      interaction.editReply({ embeds: [embed] });
    },
    onError: async ({ interaction, error }) => {
      console.log('An error occurred when executing the link command');
      console.log(error);
      interaction.deferred ? interaction.editReply(`Uh oh... ${error.message}`) : interaction.reply({ content: `Uh oh... ${error.name}`, ephemeral: true });
    },
  },
} as ICommand;
