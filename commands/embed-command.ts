import { SlashCommandBuilder } from '@discordjs/builders';
import { Collection, MessageEmbed } from 'discord.js';
import { ICommand } from '../typings';

const allEmbeds = new Collection<number, MessageEmbed>();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embedbuilder')
    .setDescription('A builder for creating custom message embeds')
    .addSubcommand(subcommand => {
      return subcommand.setName('create')
        .setDescription('Creates a new message embed');
    }),

  type: 'GUILD',

  callback: async ({ interaction, channel }) => {
    if (!interaction.memberPermissions?.has('MANAGE_MESSAGES')) return interaction.reply({ content: 'You do not have permission to use this command', ephemeral: true });

    const id = allEmbeds.size + 1;
    allEmbeds.set(id, new MessageEmbed());

    interaction.reply({ content: `Created a new embed with the ID of ${id}`, ephemeral: true });
  },
} as ICommand;
