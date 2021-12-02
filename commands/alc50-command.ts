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
    await interaction.deferReply();

    const mojangData = await fetch(`https://api.mojang.com/users/profiles/minecraft/${args.getString('player')}`);

    if (mojangData.status == 204) {
      await interaction.editReply(`The player ${args.getString('player')} was not found`);

      return;
    }

    const mojangJSON = await mojangData.json();

    const hypixelData = await fetch(`https://api.hypixel.net/skyblock/profiles?uuid=${mojangJSON.id}&key=${API_KEY}`);
    const hypixelJSON = await hypixelData.json();

    if (!hypixelJSON.success) {
      console.log('nope');

      const errorEmbed = new MessageEmbed()
        .setTitle('Error')
        .setDescription(`Code: **${hypixelData.status}**\nReason: ${hypixelJSON.cause}`);

      await interaction.editReply({ embeds: [errorEmbed] });

      return;
    }

    let profile = args.getString('profile') ? null : hypixelJSON.profiles[0];

    if (!profile) {
      for (const playerProfile of hypixelJSON.profiles) {
        if (playerProfile.cute_name.toLowerCase() == args.getString('profile').toLowerCase()) {
          profile = playerProfile;
        }
      }
    }

    interaction.editReply(`Found! ID is ${profile.profile_id}`);
  },
} as ICommand;
