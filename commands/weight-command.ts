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
        goldIngotsPerCoin: 0.25,
        weightOfGoldMeterInKilo: 19_300,
      };
      const miscellaneous = {
        planeWeight: 200_000,
      };
      const stages = {
        Chad: 1_000_000_000_000,
        Ripped: 10_000_000_000,
        Buff: 50_000_000,
        Strong: 5_000_000,
        Average: 800_000,
        Weak: 100_000,
        Nerd: 10_000,
        'Are you even trying?': 0,
      };

      const coins = profile.members[mojangJSON.id].coin_purse;
      const purseWeight = coinData.goldIngotsPerCoin * coins * coinData.goldMetersPerIngot * coinData.weightOfGoldMeterInKilo;
      let stage: string;
      for (stage in stages) {
        if (purseWeight >= stages[stage]) break;
      }

      const embed = new MessageEmbed()
        .setTitle(`${mojangJSON.name}'s Asian Weight on ${profile.cute_name}`)
        .setDescription(`Purse Weight: **${NumberUtil.format(purseWeight, 3)} kilograms** (Thats about **${Math.round(purseWeight / miscellaneous.planeWeight).toLocaleString('en-US')} planes** in your purse!)\nStage: **${stage}**`)
        .setThumbnail(`https://mc-heads.net/body/${mojangJSON.id}`)
        .addField('Variables Used', `Gold Ingots per Coin: ${coinData.goldIngotsPerCoin}\nGold Blocks per Ingot: ${(coinData.goldMetersPerIngot).toFixed(2)}\nWeight of Gold Block: ${coinData.weightOfGoldMeterInKilo.toLocaleString('en-US')}kg`)
        .setColor('GREEN')
        .setTimestamp();

      interaction.editReply({ embeds: [embed] });
    },
  },
} as ICommand;
