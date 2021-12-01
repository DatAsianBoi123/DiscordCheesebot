import { SlashCommandBuilder } from '@discordjs/builders';
import { ColorResolvable, MessageEmbed } from 'discord.js';
import { ICommand } from '../typings';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Pings the bot'),

  callback: async ({ interaction }) => {
    const clientPing = Date.now() - interaction.createdTimestamp;

    let pingColor: ColorResolvable;

    if (clientPing < 50) {
      pingColor = 'GREEN';
    } else if (clientPing < 100) {
      pingColor = 'YELLOW';
    } else {
      pingColor = 'RED';
    }

    const embed = new MessageEmbed()
      .setTitle('🏓 Pong!')
      .addField(
        'Client Ping',
        `${clientPing}ms`,
      )
      .setColor(pingColor);

    interaction.reply({ embeds: [embed] });
  },
} as ICommand;
