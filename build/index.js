"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_js_1 = require("./config.js");
const config = __importStar(require("./config.js"));
const burgerclient_1 = require("burgerclient");
const path_1 = __importDefault(require("path"));
for (const key of Object.keys(config)) {
    if (!config[key])
        throw new Error(`Config var ${key} does not exist`);
}
const client = new burgerclient_1.BurgerClient({
    intents: [discord_js_1.GatewayIntentBits.Guilds],
    typescript: false,
    partials: [discord_js_1.Partials.Channel],
    testGuild: config_js_1.GUILD_ID,
    mongoURI: config_js_1.MONGO_URI,
});
client.onReady(async (clientUser) => {
    const timeBegin = Date.now();
    await client.registerAllCommands(path_1.default.resolve(__dirname, 'commands'));
    await client.updateCommands();
    await client.updatePermissions();
    clientUser.user.setActivity({ name: 'everything', type: discord_js_1.ActivityType.Watching });
    burgerclient_1.BurgerClient.logger.log(`Ready! Logged in as ${clientUser.user.tag} (${Math.round((Date.now() - timeBegin) * 100) / 100 / 1000}s)`);
});
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand())
        return;
    await client.resolveCommand(interaction);
});
client.login(config_js_1.TOKEN);
//# sourceMappingURL=index.js.map