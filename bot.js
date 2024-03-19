module.exports = (config) => {
    let ee = require('events').EventEmitter
    let bot = new ee()
    ee = undefined

    bot._client = require('minecraft-protocol').createClient(config.options)

    bot.setMaxListeners((2**31)-1)
    bot._client.setMaxListeners((2**31)-1)

    for (let i in config) {
        bot[i] = config[i]
    }

    // Load bot stuff
    bot.ChatMessage = require('prismarine-chat')(require('prismarine-registry')(bot._client.version))
    bot.randomData = {}
    bot.randomData.antiSpamCounter = 0

    // Load modules
    config.modules.forEach(module => {
        try {
            module(bot, config)
        } catch (e) {
            console.error(e.stack)
        }

        module = undefined
    })

    // Chat logging
    if (config.config.config.logMessages === true) bot._client.on('message', msg => {
        try {
            bot.randomData.antiSpamCounter++
            if (bot.randomData.antiSpamCounter < 50) {
                bot.logging.log(`${msg.toAnsi()}`)
            }
            setTimeout(() => {
                try {
                    bot.randomData.antiSpamCounter--
                } catch {}
            }, 1E3)
        } catch (e) {}
    })

    // Error handling
    bot._client.on('error', (e) => {if (bot !== undefined && bot._client !== undefined) bot._client.end(e.message) /* handle errors */})

    // Ram clearer
    bot._client.once('end', () => bot = undefined)

    // Login packet stuff
    bot._client.on('login', (packet) => {
        bot._client.loginPacket = packet
    })

    // Logging
    if (config.config.config.logMessages === true) bot.once('spawn', () => {
        bot.logging.success(`Logged in`)
    })

    if (config.config.config.logMessages === true) bot.once('end', (reason) => {
        bot.logging.warn(`Disconnected: ${reason}`)
    })

    // Allow pushing "bot" to "bots"
    return bot
}