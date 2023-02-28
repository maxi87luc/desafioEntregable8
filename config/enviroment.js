import * as dotenv from 'dotenv' 
import yargs from 'yargs'


const args = yargs(process.argv.slice(2))
    .default ({
        port: 8080
    })
    .argv
dotenv.config()


export const mongoUri = process.env.MONGO_URI;
export const mongoURL = process.env.MONGO_URL;
export const port = args.port;
