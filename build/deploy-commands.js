"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const burgerclient_1 = require("burgerclient");
const config_1 = require("./config");
const commands = burgerclient_1.BurgerClient.allCommandsInDir('./commands', true);
if (commands === null)
    process.exit(1);
burgerclient_1.BurgerClient.deployCommands({
    guildId: config_1.GUILD_ID,
    token: config_1.TOKEN,
    userId: config_1.CLIENT_ID,
}, commands).then(() => {
    burgerclient_1.BurgerClient.logger.log('Done!');
});
//# sourceMappingURL=deploy-commands.js.map