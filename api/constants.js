const { CommandBase } = require('./command-base');

module.exports = {
  DIMENSIONS: [
    'overworld',
    'nether',
    'end'
  ],
  /**
   * @type { Map<import('discord.js/typings/index.js').Snowflake, CommandBase> }
   */
  ALL_COMMANDS: new Map(),
  VERSION: '0.1.0'
}
