import { SlashCommandBuilder } from '@discordjs/builders';
import { MinecraftUserFetchModel, SkyblockProfilesFetchModel } from '../typings';
import { API_KEY } from '../config';
import fetch from 'node-fetch';
import { EmbedBuilder } from 'discord.js';
import { SkillsUtil } from '../util/skyblock-skill-util';
import { NumberUtil } from '../util/number-util';
import { ICommand } from 'burgerclient';

const command: ICommand = {
  data: new SlashCommandBuilder()
    .setName('alc50')
    .setDescription('Shows how much xp is needed for alchemy 50, as well as cost')
    .addStringOption(option => {
      return option.setName('player')
        .setDescription('The name of the player')
        .setRequired(true);
    })
    .addStringOption(option => {
      return option.setName('profile')
        .setDescription('The player\'s profile')
        .setRequired(false);
    }) as SlashCommandBuilder,

  type: 'GLOBAL',

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
        const errorEmbed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription(`Code: **${hypixelData.status}**\nReason: ${hypixelJSON.cause}`)
          .setColor('Red');

        await interaction.editReply({ embeds: [errorEmbed] });

        return;
      }

      if (!hypixelJSON.profiles || hypixelJSON.profiles.length < 1) {
        await interaction.editReply('That player never joined skyblock');

        return;
      }

      let profile = hypixelJSON.profiles[0];
      const profileArgument = args.getString('profile');
      if (profileArgument) {
        const foundProfile = hypixelJSON.profiles.find((playerProfile) => playerProfile.cute_name.toLowerCase() === profileArgument.toLowerCase());

        if (!foundProfile) {
          const errorEmbed = new EmbedBuilder()
            .setTitle('Error')
            .setDescription(`Code: **404**\nReason: The profile ${args.getString('profile')} was not found.`)
            .setTimestamp()
            .setColor('Red');

          await interaction.editReply({ embeds: [errorEmbed] });

          return;
        }

        profile = foundProfile;
      }

      const player = profile.members[mojangJSON.id];
      const alchemyXp: number = player.experience_skill_alchemy ?? 0;

      let icon = '';
      switch (profile.game_mode) {
      case 'bingo':
        icon = ':game_die:';
        break;

      case 'ironman':
        icon = '<:ironman:932021735639891968>';
        break;

      case 'island':
        icon = ':island:';
        break;
      }

      const skillEmbed = new EmbedBuilder()
        .setTitle(`Displaying Alchemy Stats for ${icon}${mojangJSON.name}`)
        .addFields({ name: `Alchemy ${SkillsUtil.getLevel(alchemyXp, 'ALCHEMY')}`, value: `${NumberUtil.format(alchemyXp, 2)} / ${NumberUtil.format(SkillsUtil.getXpForLevel(50), 2)} XP (${Math.round((alchemyXp / SkillsUtil.getXpForLevel(50)) * 10000) / 100}%) to Alchemy 50` })
        .setColor('Purple')
        .setFooter({ text: `Profile: ${profile.cute_name}` })
        .setTimestamp(Date.now());

      interaction.editReply({ embeds: [skillEmbed] });
    },
  },
};

module.exports = command;
