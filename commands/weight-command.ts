import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';
import { API_KEY } from '../config';
import { ICommand, MinecraftUserFetchModel, SkyblockProfilesFetchModel } from '../typings';
import { NumberUtil } from '../util/number-util';
import fetch from 'node-fetch';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('weight')
    .setDescription('Calculates how much your purse weighs')
    .addStringOption(option => {
      return option.setName('player')
        .setDescription('The name of the player')
        .setRequired(true);
    })
    .addStringOption(option => {
      return option.setName('profile')
        .setDescription('The player\'s profile')
        .setRequired(false);
    }),

  type: 'GUILD',

  listeners: {
    onExecute: async ({ interaction, args }) => {
      await interaction.deferReply();

      const mojangData = await fetch(`https://api.mojang.com/users/profiles/minecraft/${args.getString('player')}`);

      if (mojangData.status === 204) {
        await interaction.editReply(`The player ${args.getString('player')} was not found`);

        return;
      }

      const mojangJSON = await mojangData.json() as MinecraftUserFetchModel;

      const hypixelData = await fetch(`https://api.hypixel.net/skyblock/profiles?uuid=${mojangJSON.id}&key=${API_KEY}`);
      const hypixelJSON = await hypixelData.json() as SkyblockProfilesFetchModel;

      if (!hypixelJSON.success) {
        const errorEmbed = new MessageEmbed()
          .setTitle('Error')
          .setDescription(`Code: **${hypixelData.status}**\nReason: ${hypixelJSON.cause}`)
          .setColor('RED');

        await interaction.editReply({ embeds: [errorEmbed] });

        return;
      }

      if (!hypixelJSON.profiles) {
        await interaction.editReply('That player never joined skyblock');

        return;
      }

      let profile = args.getString('profile') ? null : hypixelJSON.profiles[0];

      if (!profile) {
        profile = hypixelJSON.profiles.find((playerProfile) => playerProfile.cute_name.toLowerCase() === args.getString('profile').toLowerCase());

        if (!profile) {
          const errorEmbed = new MessageEmbed()
            .setTitle('Error')
            .setDescription(`Code: **404**\nReason: The profile ${args.getString('profile')} was not found.`)
            .setTimestamp()
            .setColor('RED');

          await interaction.editReply({ embeds: [errorEmbed] });

          return;
        }
      }

      const coinData = {
        goldMetersPerIngot: 1 / 9,
        goldIngotsPerCoin: 0.375,
        weightOfGoldMeterInKilo: 19300,
      };

      const coins = profile.members[mojangJSON.id].coin_purse;

      interaction.reply(`Weight: ${NumberUtil.format((coins * coinData.goldIngotsPerCoin) * coinData.goldMetersPerIngot * coinData.weightOfGoldMeterInKilo, 3)}kg`);
    },
  },
} as ICommand;
