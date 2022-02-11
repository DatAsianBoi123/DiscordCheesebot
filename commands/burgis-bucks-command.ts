import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';
import burgisBuckModel from '../models/burgis-buck-model';
import { ICommand } from '../typings';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('burgisbucks')
    .setDescription('All burgis buck related commands')
    .addSubcommand(subcommand => {
      return subcommand.setName('bal')
        .setDescription('Displays a user\'s current balance')
        .addUserOption(option => {
          return option.setName('user')
            .setDescription('The user the command is directed towards')
            .setRequired(false);
        });
    })
    .addSubcommand(subcommand => {
      return subcommand.setName('set')
        .setDescription('Sets a user\'s burgis bucks to an amount')
        .addUserOption(option => {
          return option.setName('user')
            .setDescription('The user the command is directed towards')
            .setRequired(true);
        })
        .addIntegerOption(option => {
          return option.setName('amount')
            .setDescription('The amount to set by')
            .setRequired(true);
        });
    })
    .addSubcommand(subcommand => {
      return subcommand.setName('operation')
        .setDescription('Performs an operation on a user')
        .addStringOption(option => {
          return option.setName('operation')
            .setDescription('The operation')
            .addChoices([
              ['add', 'ADD'],
              ['subtract', 'SUBTRACT'],
            ])
            .setRequired(true);
        })
        .addUserOption(option => {
          return option.setName('user')
            .setDescription('The user')
            .setRequired(true);
        })
        .addIntegerOption(option => {
          return option.setName('amount')
            .setDescription('The amount')
            .setRequired(true);
        });
    }),

  type: 'GUILD',
  disallowedTextChannels: ['DM'],

  listeners: {
    onExecute: async ({ interaction, args, user: author }) => {
      await interaction.deferReply();

      const user = args.getUser('user') ?? author;
      const buckModel = await burgisBuckModel.model.findOne({ id: user.id }) ?? await burgisBuckModel.model.create({ id: user.id, balance: 0 });

      switch (args.getSubcommand()) {
      case 'bal':
        const embed = new MessageEmbed()
          .setTitle(user.username)
          .addField('Balance', buckModel.balance.toString())
          .setTimestamp()
          .setColor('ORANGE');

        interaction.editReply({ embeds: [embed] });

        break;

      case 'set':
        if (!interaction.memberPermissions?.has('MANAGE_GUILD')) return interaction.editReply('You do not have permission to use this command');

        const amount = args.getInteger('amount');

        await burgisBuckModel.model.updateOne({ id: user.id }, { $set: { balance: amount } }, { upsert: true });

        interaction.editReply(`Successfully set ${user.username}'s burgis bucks to ${amount}`);

        break;

      case 'operation':
        if (!interaction.memberPermissions?.has('MANAGE_GUILD')) return interaction.editReply('You do not have permission to use this command');

        switch (args.getString('operation')) {
        case 'ADD':
          await buckModel.update({ $set: { balance: buckModel.balance + args.getInteger('amount') } });

          interaction.editReply(`Successfully added ${args.getInteger('amount')} to ${user.username}'s account`);

          break;

        case 'SUBTRACT':
          await buckModel.update({ $set: { balance: buckModel.balance - args.getInteger('amount') } });

          interaction.editReply(`Successfully subtracted ${args.getInteger('amount')} to ${user.username}'s account`);

          break;
        }

        break;
      }
    },
  },
} as ICommand;
