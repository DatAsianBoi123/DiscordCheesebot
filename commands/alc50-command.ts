import { SlashCommandBuilder } from '@discordjs/builders';
import { ICommand } from '../typings';
import { API_KEY } from '../config';
import fetch from 'node-fetch';
import { MessageEmbed } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('alc50')
    .setDescription('Shows how much xp is needed for alchemy 50, as well as cost')
    .addStringOption(option => {
      return option.setName('player')
        .setDescription('The player name')
        .setRequired(true);
    })
    .addStringOption(option => {
      return option.setName('profile')
        .setDescription('The player profile')
        .setRequired(false);
    }),

  callback: async ({ interaction, args }) => {
    interaction.deferReply();

    const mojangData = await fetch(`https://api.mojang.com/users/profiles/minecraft/${args.getString('name')}`);

    if (mojangData.status == 204) {
      interaction.editReply(`The player ${args.getString('name')} was not found`);

      return;
    }

    const mojangJSON = await mojangData.json();

    const hypixelData = await fetch(`https://api.hypixel.net/skyblock/profiles?key=${API_KEY}&uuid=${mojangJSON.id}`);
    const hypixelJSON = await hypixelData.clone().json();

    if (!hypixelJSON.success) {
      const errorEmbed = new MessageEmbed()
        .setTitle('Error')
        .setDescription(`Code: **${hypixelData.status}**\nReason: ${hypixelJSON.cause}`);

      interaction.editReply({ embeds: [errorEmbed] });

      return;
    }

    interaction.editReply(`Found! First profile cute name: ${hypixelJSON.profiles[0].cute_name}`);
  },
} as ICommand;
