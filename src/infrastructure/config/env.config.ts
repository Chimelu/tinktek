import Joi from "joi";
import { config as dotenvConfig } from "dotenv";

// Load environment variables from .env file
dotenvConfig();

const schema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test", "provision")
    .default("development"),

  PORT: Joi.number().required(),



  // DBCONFIG
  DB_TYPE: Joi.string().required().description("DB type"),
  DB_HOST: Joi.string().required().description("DB instance url"),
  DB_PORT: Joi.string().required().description("DB connection port"),
  DB_USERNAME: Joi.string().required().description("DB connection username"),
  DB_PASSWORD: Joi.string().required().description("DB connection password"),
  DB_DATABASE: Joi.string().required().description("Db title"),
  SECRET: Joi.string().required().description("Session secret"),
  ADMIN_EMAILS: Joi.string().required().description("Session secret"),





})
  .unknown()
  .required();

const { error, value: env } = schema.validate(process.env);



if (error) {
  console.error(`Config validation error: ${error.message}`);
  throw new Error(`Config validation error: ${error.message}`);
}




const config = {
  env: env.NODE_ENV,
  port: env.PORT,
  secret: env.SECRET,
  dbType: env.DB_TYPE,
  dbhost: env.DB_HOST,
  dbPort: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  apiKey: env.API_KEY,
	apiSecret: env.API_SECRET,
	cloudName: env.CLOUD_NAME,
  adminEmails:env.ADMIN_EMAILS
  



};

export const { PORT } = env.PORT;
export default config;
