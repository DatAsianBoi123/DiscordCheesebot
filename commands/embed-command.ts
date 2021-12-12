import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';
import { ICommand } from '../typings';

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
    if (interaction.member && !interaction.memberPermissions.has('MANAGE_MESSAGES')) return interaction.reply({ content: 'You do not have permission to use this command', ephemeral: true });

    const embed = new MessageEmbed()
      .setTitle('Test')
      .setDescription('Poggers');

    await channel.send({ embeds: [embed] });

    interaction.reply({ content: 'Sent', ephemeral: true });
  },
} as ICommand;
