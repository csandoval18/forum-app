"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Users_1 = require("./entities/Users");
const Posts_1 = require("./entities/Posts");
const dataSource = new typeorm_1.DataSource({
    type: 'postgres',
    database: 'forum',
    username: 'Christian',
    password: 'root',
    logging: true,
    synchronize: true,
    entities: [Posts_1.Posts, Users_1.Users],
});
exports.default = dataSource;
//# sourceMappingURL=typeorm.config.js.map