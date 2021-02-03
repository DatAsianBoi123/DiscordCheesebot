const Discord = require('discord.js');
const client = new Discord.Client();

const fs = require('fs');
const mongoose = require('mongoose');

const skillxp = require('./skillxp');

const prefix = 'b.';

const uri = `mongodb+srv://DatAsianBoi123:${process.env.mongopass}@mydiscordbot.xudyc.mongodb.net/discord-bot?retryWrites=true&w=majority`;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected'))
  .catch(() => console.log(`Error connecting to heroku`));

const categories = ['General', 'Guild', 'Hypixel', 'Skyblock', 'Burgis Bucks', 'Polls', 'Misc.', 'Admin'];

client.commands = new Discord.Collection()

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const files of commandFiles) {
  const command = require(`./commands/${files}`);

  client.commands.set(command.name, command);
}

client.once('ready', () => {
  console.log('Ready');
  client.users.fetch('721020694493790330').then((user) => {
    user.send('Ready');
  });
  addData('Verify', 'verify', {
    users: {
      user: null
    }
  });

  client.user.setActivity(`${prefix}help`);
});

client.on('message', async message => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  const commandScript = client.commands.get(command);

  if (!commandScript && command != '') return message.reply(`This command does not exist! (${command})`);
  if (commandScript.disabled == true) return message.reply(`This command is currently disabled (${command})`);

  commandScript.execute(message, args);
});

const getLevelByXp = function (xp, hypixelProfile, type = 'regular') {
  let xp_table;

  switch (type) {
    case 'runecrafting':
      xp_table = skillxp.runecrafting_xp;
      break;
    case 'dungeon':
      xp_table = skillxp.dungeon_xp;
      break;
    default:
      xp_table = skillxp.leveling_xp;
  }

  if (isNaN(xp)) {
    return {
      xp: 0,
      level: 0,
      xpCurrent: 0,
      xpForNext: xp_table[1],
      progress: 0
    };
  }

  let xpTotal = 0;
  let level = 0;

  let xpForNext = Infinity;

  let maxLevel = Object.keys(xp_table).sort((a, b) => Number(a) - Number(b)).map(a => Number(a)).pop();
  let maxLevelCap = maxLevel;

  if (skillxp.skills_cap[type] > maxLevel && type in skillxp.skills_achievements) {
    xp_table = Object.assign(skillxp.xp_past_50, xp_table);

    maxLevel = Object.keys(xp_table).sort((a, b) => Number(a) - Number(b)).map(a => Number(a)).pop();
    maxLevelCap = Math.max(maxLevelCap, hypixelProfile.achievements[skillxp.skills_achievements[type]]);
  }

  for (let x = 1; x <= maxLevelCap; x++) {
    xpTotal += xp_table[x];

    if (xpTotal > xp) {
      xpTotal -= xp_table[x];
      break;
    } else {
      level = x;
    }
  }

  let xpCurrent = Math.floor(xp - xpTotal);

  if (level < maxLevel)
    xpForNext = Math.ceil(xp_table[level + 1]);

  let progress = Math.max(0, Math.min(xpCurrent / xpForNext, 1));

  return {
    xp,
    level,
    maxLevel,
    xpCurrent,
    xpForNext,
    progress
  };
}

const nFormatter = function (num, digits) {
  if (num == Infinity) return '∞';
  var si = [{
      value: 1,
      symbol: ''
    },
    {
      value: 1E3,
      symbol: 'k'
    },
    {
      value: 1E6,
      symbol: 'm'
    },
    {
      value: 1E9,
      symbol: 'G'
    },
    {
      value: 1E12,
      symbol: 'T'
    },
    {
      value: 1E15,
      symbol: 'P'
    },
    {
      value: 1E18,
      symbol: 'E'
    }
  ];
  var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

const addData = async function (dataType, dataTypePath, object) {
  const Data = require(`./models/${dataTypePath}`);
  let objectData = '';
  await Data.find()
    .then(result => {
      objectData = result;
    });
  for (let i = 0; i < objectData.length; i++)
    if (objectData[i].type == dataType) return;

  object.type = dataType;
  const data = new Data(object);

  data.save();
}
const getDataByType = async function (dataType, dataTypePath) {
  const Data = require(`./models/${dataTypePath}`);
  let dataObject = '';
  await Data.find()
    .then(result => {
      dataObject = result;
    }).catch(err => {
      console.log(err);
    });

  for (let i = 0; i < dataObject.length; i++)
    if (dataObject[i].type == dataType) return dataObject[i];
}
const updateById = async function (id, dataTypePath, updatedValues) {
  const Data = require(`./models/${dataTypePath}`);

  Data.findById(id)
    .then(result => {
      if (!result) return console.log('No object found');

      for (let i = 0; i < Object.keys(updatedValues).length; i++) {
        result[Object.keys(updatedValues)[i]] = updatedValues[Object.keys(updatedValues)[i]];
      }
      result.save(err => {
        if (err) console.log(err);
      });
    })
    .catch(err => {
      console.log(err);
    });
}

module.exports = {
  addData,
  getDataByType,
  updateById,
  getLevelByXp,
  nFormatter,
  prefix,
  categories
}

client.login(process.env.token);