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
export const mongoSecret = process.env.MONGO_SECRET;
export const port = args.port;
export const info = {
    args: process.argv.slice(2),
    platform: process.platform,
    nodeVersion: process.version,
    rss: process.memoryUsage(),
    path: process.argv.slice[0],
    pid: process.pid,
    folder: process.cwd()
}
