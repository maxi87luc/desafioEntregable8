import log4js from 'log4js'



log4js.configure({
    appenders:{
        miLoggerConsole: {type: "console"},
        miLoggerFile: {type: "file", filename: "warn.log"},
        miLoggerFile2: {type: "file", filename: "error.log"}
    },
    categories: {
        default: {appenders:["miLoggerConsole"], level: "info"},
        warn: {appenders:["miLoggerConsole", "miLoggerFile"], level: "warn"},
        err: {appenders:["miLoggerConsole", "miLoggerFile2"], level: "error"}
    }
})