module.exports = {
    name: 'myinfo',
    description: 'Shows your user information',
    async execute() {
        const prefix = require('../index').prefix;

        if (!message.mentions.users.size) {
            let personName = message.member.displayName;
            let personID = message.member.id;
            return message.channel.send(`You're name is ${personName}. \nYou're ID is ${personID}.`);
        }

        const personInfoList = message.mentions.users.map(user => {
            return `${user.username}'s ID is ${user.id}`;
        });
        message.channel.send(personInfoList);
    }
}