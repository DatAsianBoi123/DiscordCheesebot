module.exports = {
    name: 'info',
    description: 'Shows info about the server',
    async execute() {
        let embedInfo = new Discord.MessageEmbed()
            .setTitle('Server Info:')
            .setDescription(`Server name: ${message.guild.name} \nTotal members: ${message.guild.memberCount}`)
            .setColor('ORANGE');
        message.channel.send(embedInfo);
    }
}