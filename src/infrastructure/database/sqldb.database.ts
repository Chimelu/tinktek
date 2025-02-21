import { Sequelize } from "sequelize";
import config from "../config/env.config";
import e from "cors";

const { database, password, username, dbPort, dbhost, env } = config;

type Models = {
  [key: string]: {
    sync: (options: { alter: boolean }) => Promise<void>;
    associate?: (models: Models) => void;
  };
};

export const DBSource = new Sequelize({
  host: dbhost,
  port: dbPort,
  username,
  password,
  database,
  dialect: "postgres",
  pool: {
    max: 10,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
  dialectOptions: env!=="development" ? { ssl: { require: true, rejectUnauthorized: false } } : {}, // ✅ Dynamic SSL
  logging: false,
});

const SequelizeMigration = async () => {   
  const schemas = require("../../core/models");

  Object.keys(schemas).forEach((modelName) => {
    // console.log(`Associating model: ${modelName}`);
    if (schemas[modelName]?.associate) {
      schemas[modelName].associate(schemas);
    }
  });
  
  for (const schema in schemas) {
    // console.log(`Syncing model: ${schema}`);
    await schemas[schema].sync({ alter: true });

  }
    

};
  

export const startDBServer = async () => {
  try {
    // Initialize the data source
    await DBSource.authenticate();
    console.log("Connection has been established successfully.");
    await SequelizeMigration();
  } catch (error) {
    console.error("Error during Data Source initialization:", error);
  }
};
