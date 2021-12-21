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
      return subcommand.setName('send')
        .setDescription('Sends a message embed')
        .addNumberOption(option => {
          return option.setName('id')
            .setDescription('The id of the message embed');
        });
    }),

  type: 'GUILD',

  callback: async ({ interaction, args, channel }) => {
    if (!interaction.memberPermissions?.has('MANAGE_MESSAGES')) return interaction.reply({ content: 'You do not have permission to use this command', ephemeral: true });

    const id = args.getNumber('id');

    switch (args.getSubcommand()) {
    case 'create':
      const newId = allEmbeds.size + 1;
      allEmbeds.set(newId, new MessageEmbed());

      interaction.reply({ content: `Created a new embed with the ID of ${newId}`, ephemeral: true });

      break;

    case 'send':
      channel.send({ embeds: [allEmbeds.get(id)] });
    }
  },
} as ICommand;
