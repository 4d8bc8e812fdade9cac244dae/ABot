module.exports = (client, context) => {
    client.logging = {}

    client.logging.log = (message) => {
        console.log(`\x1B[37m[<${
            new Date().toLocaleString()
        }> LOG] [${
            context.options.host
        }:${
            context.options.port
        }] (${context.serverConfig.name}) ${message}\x1B[0m`)
    }

    client.logging.warn = (message) => {
        console.log(`\x1B[33m[<${
            new Date().toLocaleString()
        }> WARN] [${
            context.options.host
        }:${
            context.options.port
        }] (${context.serverConfig.name}) ${message}\x1B[0m`)
    }

    client.logging.error = (message) => {
        console.log(`\x1B[31m[<${
            new Date().toLocaleString()
        }> ERROR] [${
            context.options.host
        }:${
            context.options.port
        }] (${context.serverConfig.name}) ${message}\x1B[0m`)
    }

    client.logging.success = (message) => {
        console.log(`\x1B[32m[<${
            new Date().toLocaleString()
        }> SUCCESS] [${
            context.options.host
        }:${
            context.options.port
        }] (${context.serverConfig.name}) ${message}\x1B[0m`)
    }
}