module.exports = {
  name: 'source',
  description: 'Displays this bot\'s source code',
  disabled: false,
  category: 'General',
  async execute(message, args) {
    message.channel.send('Here is my source code! \nhttps://github.com/DatAsianBoi123/DiscordCheesebot');
  }
}