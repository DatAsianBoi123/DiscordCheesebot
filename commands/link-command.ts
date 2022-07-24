import { SlashCommandBuilder } from '@discordjs/builders';
import { EmbedBuilder } from 'discord.js';
import { API_KEY } from '../config';
import accountLinksModel from '../models/account-links-model';
import { HypixelPlayerFetchModel, MinecraftUserFetchModel } from '../typings';
import fetch from 'node-fetch';
import { ICommand } from 'burgerclient';

const command: ICommand = {
  data: new SlashCommandBuilder()
    .setName('link')
    .setDescription('Links a minecraft account to your discord account')
    .addStringOption(option => {
      return option.setName('name')
        .setDescription('The name of the minecraft account')
        .setRequired(true);
    }) as SlashCommandBuilder,

  type: 'GLOBAL',

  listeners: {
    onExecute: async ({ interaction, user, args }) => {
      await interaction.deferReply();

      const mojangData = await fetch(`https://api.mojang.com/users/profiles/minecraft/${args.getString('name')}`);

      if (mojangData.status === 204) {
        await interaction.editReply(`The player ${args.getString('name')} was not found`);

        return;
      }

      const mojangJSON = await mojangData.json() as MinecraftUserFetchModel;

      const hypixelData = await fetch(`https://api.hypixel.net/player?uuid=${mojangJSON.id}&key=${API_KEY}`);
      const hypixelJSON = await hypixelData.json() as HypixelPlayerFetchModel;

      if (!hypixelJSON.success) {
        const errorEmbed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription(`Code: **${hypixelData.status}**\nReason: ${hypixelJSON.cause}`)
          .setColor('Red');

        await interaction.editReply({ embeds: [errorEmbed] });

        return;
      }

      if (!hypixelJSON.player) {
        await interaction.editReply('This player has never joined hypixel');

        return;
      }

      if (hypixelJSON.player.socialMedia?.links?.DISCORD !== user.tag) {
        await interaction.editReply('That hypixel account is not linked with your discord account!');

        return;
      }

      await accountLinksModel.model.updateOne({ discord_id: user.id }, {
        discord_id: user.id,
        minecraft_uuid: mojangJSON.id,
      }, { upsert: true });

      const embed = new EmbedBuilder()
        .setTitle('Success!')
        .setDescription(`Successfully linked your discord account with the minecraft account ${mojangJSON.name}`)
        .setFooter({ text: `Minecraft UUID: ${mojangJSON.id}, Discord ID: ${user.id}` })
        .setTimestamp()
        .setColor('Green');

      interaction.editReply({ embeds: [embed] });
    },
  },
};

module.exports = command;
