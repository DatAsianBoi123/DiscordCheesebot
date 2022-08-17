"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MONGO_URI = exports.API_KEY = exports.GUILD_ID = exports.CLIENT_ID = exports.TOKEN = void 0;
require("dotenv/config");
exports.TOKEN = process.env.token;
exports.CLIENT_ID = process.env.client_id;
exports.GUILD_ID = process.env.test_guild;
exports.API_KEY = process.env.apikey;
exports.MONGO_URI = process.env.mongouri;
//# sourceMappingURL=config.js.map