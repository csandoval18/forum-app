"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Users_1 = require("./entities/Users");
const Posts_1 = require("./entities/Posts");
const path_1 = __importDefault(require("path"));
const Upvotes_1 = require("./entities/Upvotes");
require("dotenv-safe/config");
const dataSource = new typeorm_1.DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    logging: true,
    migrations: [path_1.default.join(__dirname, './migrations/*')],
    entities: [Posts_1.Posts, Users_1.Users, Upvotes_1.Upvotes],
});
exports.default = dataSource;
//# sourceMappingURL=typeorm.config.js.map