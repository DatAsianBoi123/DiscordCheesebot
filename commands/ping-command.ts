import { SlashCommandBuilder } from '@discordjs/builders';
import { ColorResolvable, MessageEmbed } from 'discord.js';
import { API_KEY } from '../config';
import { ICommand } from '../typings';
import fetch from 'node-fetch';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Pings the bot'),

  type: 'GUILD',

  listeners: {
    onExecute: async ({ interaction }) => {
      const clientPing = Date.now() - interaction.createdTimestamp;

      let pingColor: ColorResolvable;

      if (clientPing < 50) {
        pingColor = 'GREEN';
      } else if (clientPing < 100) {
        pingColor = 'YELLOW';
      } else {
        pingColor = 'RED';
      }

      const currentTime = Date.now();
      await fetch(`https://api.hypixel.net/key?key=${API_KEY}`);
      const apiPing = Date.now() - currentTime;

      const embed = new MessageEmbed()
        .setTitle('🏓 Pong!')
        .addField(
          'Client Ping',
          `${clientPing}ms`,
        )
        .addField(
          'Hypixel API Latency',
          `${apiPing}ms`,
        )
        .setColor(pingColor);

      interaction.reply({ embeds: [embed] });
    },
  },
} as ICommand;
