// db.ts
import "reflect-metadata";
import { DataSource } from 'typeorm';


const pool = new DataSource({
  type :"postgres",
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
})

export default pool;