module.exports = {
  name: 'source',
  description: 'Displays this bot\'s source code',
  async execute() {
    message.channel.send('Here is my source code! \nhttps://github.com/DatAsianBoi123/DiscordCheesebot');
  }
}