import { SlashCommandBuilder } from '@discordjs/builders';
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
    }),

  type: 'GUILD',
  disallowedTextChannels: ['DM'],

  listeners: {
    onExecute: async ({ interaction, args, user: author }) => {
      await interaction.deferReply();

      const user = args.getUser('user') ?? author;

      switch (args.getSubcommand()) {
      case 'bal':
        let model = await burgisBuckModel.model.findOne({ id: user.id });

        if (!model) {
          model = await burgisBuckModel.model.create({
            id: user.id,
            balance: 0,
          });
        }

        interaction.editReply(`${user.username} has ${model.balance} burgis bucks`);

        break;

      case 'set':
        if (!interaction.memberPermissions?.has('MANAGE_GUILD')) return interaction.editReply('You do not have permission to use this command');

        const amount = args.getInteger('amount');

        await burgisBuckModel.model.updateOne({ id: user.id }, { $set: { balance: amount } }, { upsert: true });

        interaction.editReply(`Successfully set ${user.username}'s burgis bucks to ${amount}`);

        break;
      }
    },
  },
} as ICommand;
