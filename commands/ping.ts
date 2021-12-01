import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';
import { ICommand } from '../typings';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Pings the bot'),

  skip: true,

  callback: async ({ interaction }) => {
    const embed = new MessageEmbed()
      .setTitle('🏓 Pong!')
      .addField(
        'Client Ping',
        `${Date.now() - interaction.createdTimestamp}ms`,
      );

    interaction.reply({ embeds: [embed] });
  },
} as ICommand;
