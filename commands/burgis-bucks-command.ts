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
    }),

  type: 'GUILD',

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
      }
    },
  },
} as ICommand;
