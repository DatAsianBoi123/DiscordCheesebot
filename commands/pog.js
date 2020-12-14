module.exports = {
    name: 'pog',
    description: 'Shows different types of pogs',
    async execute() {
        const prefix = require('../index').prefix;

        if (!args[0]) return message.reply(`Incorrect command format! \n(${index}pog <pog name>)`);

        switch (args[0]) {
            case 'gator': {
                let gatormsg = await message.channel.send('<:GatorPOG:761662766393589770>');
                await gatormsg.react(':GatorPOG:761662766393589770');

                message.delete().catch(err => {
                    return;
                });

                break;
            }

            case 'triangle': {
                let trianglemsg = await message.channel.send('<:TrianglePOG:761668890572226611>');
                await trianglemsg.react(':TrianglePOG:761668890572226611');

                message.delete().catch(err => {
                    return;
                });

                break;
            }

            case 'shaggy': {
                let shaggymsg = await message.channel.send('<:ShaggyPOG:761672749667975208>');
                await shaggymsg.react(':ShaggyPOG:761672749667975208');

                message.delete().catch(err => {
                    return;
                });

                break;
            }

            case 'imposter': {
                let impostermsg = await message.channel.send('<:ImpostorPOG:762163842473000981>');
                await impostermsg.react(':ImpostorPOG:762163842473000981');

                message.delete().catch(err => {
                    return;
                });

                break;
            }

            case 'list': {
                let embedPog = new Discord.MessageEmbed()
                    .setTitle('List of pogs:')
                    .setDescription('gator \ntriangle \nshaggy \nimposter')
                    .setColor('#F0630F');

                message.channel.send(embedPog);

                break;
            }

            default: {
                message.reply(`Pog ${args[0]} doesn't exist!`);
            }
        }
    }
}