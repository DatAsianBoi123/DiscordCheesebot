const { ApplicationCommand } = require('discord.js')
const { ApplicationCommandBase } = require('./application-command-base')
const { CommandBase } = require('./command-base')

/**
 * Converts a command base and application command to an application command base
 * @param { ApplicationCommand } applicationCommand The application command
 * @param { CommandBase } commandBase The command base
 * @returns The application command base
 */
const commandBaseToApplicationCommandBase = (applicationCommand, commandBase) => {
  /**
   * @type { ApplicationCommandBase }
   */
  const applicationCommandBase = { };

  applicationCommandBase.applicationCommand = applicationCommand;
  applicationCommandBase.execute = commandBase.execute;
  applicationCommandBase.permissions = commandBase.permission;

  return applicationCommandBase;
}

module.exports = {
  commandBaseToApplicationCommandBase
}
