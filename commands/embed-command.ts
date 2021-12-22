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
    })
    .addSubcommand(subcommand => {
      return subcommand.setName('title')
        .setDescription('Sets the embed title')
        .addIntegerOption(option => {
          return option.setName('id')
            .setDescription('The id of the message embed')
            .setRequired(true);
        })
        .addStringOption(option => {
          return option.setName('title')
            .setDescription('The new title')
            .setRequired(true);
        });
    })
    .addSubcommand(subcommand => {
      return subcommand.setName('send')
        .setDescription('Sends a message embed')
        .addIntegerOption(option => {
          return option.setName('id')
            .setDescription('The id of the message embed')
            .setRequired(true);
        });
    }),

  type: 'GUILD',

  callback: async ({ interaction, args, channel }) => {
    if (!interaction.memberPermissions?.has('MANAGE_MESSAGES')) return interaction.reply({ content: 'You do not have permission to use this command', ephemeral: true });

    const id = args.getInteger('id');

    switch (args.getSubcommand()) {
    case 'create':
      const newId = allEmbeds.size + 1;
      allEmbeds.set(newId, new MessageEmbed());

      interaction.reply({ content: `Created a new embed with the ID of ${newId}`, ephemeral: true });

      break;

    case 'send':
      if (!allEmbeds.has(id)) return interaction.reply({ content: `No embed found with the id of ${id}`, ephemeral: true });

      await channel.send({ embeds: [allEmbeds.get(id)] });

      interaction.reply({ content: `Sent embed with id ${id}`, ephemeral: true });

      break;

    case 'title':
      if (!allEmbeds.has(id)) return interaction.reply({ content: `No embed found with the id of ${id}`, ephemeral: true });

      allEmbeds.get(id).setTitle(args.getString('title'));

      interaction.reply({ content: `Changed the title to ${args.getString('title')}`, ephemeral: true });
    }
  },
} as ICommand;
