"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// db.ts
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const pool = new typeorm_1.DataSource({
    type: "postgres",
    username: 'postgres',
    host: 'localhost',
    database: 'chess_app',
    password: 'root',
    port: 5432,
    entities: ["./src/entities/*.ts"],
});
pool.initialize()
    .then(() => {
    console.log(`Data Source has been initialized`);
})
    .catch((err) => {
    console.error(`Data Source initialization error`, err);
});
exports.default = pool;
