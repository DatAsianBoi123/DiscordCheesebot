import { SlashCommandBuilder } from 'discord.js';
import { ICommand } from 'typings';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('Test command'),

  adminCommand: true,
  type: 'GUILD',

  listeners: {
    onExecute: async ({ interaction }) => {
      interaction.reply('test command');
    },
  },
} as ICommand;
