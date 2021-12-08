import { SlashCommandBuilder } from '@discordjs/builders';
import { ICommand } from '../typings';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Poll commands'),

  type: 'GUILD',
  adminCommand: true,
  disallowedTextChannels: ['DM'],

  callback: async ({ interaction }) => {
    interaction.reply('Yes');
  },
} as ICommand;
