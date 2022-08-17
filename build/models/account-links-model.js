"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    minecraft_uuid: { type: String, required: true },
    discord_id: { type: String, required: true },
}, { timestamps: true });
exports.default = {
    model: (0, mongoose_1.model)('AccountLink', schema),
};
//# sourceMappingURL=account-links-model.js.map