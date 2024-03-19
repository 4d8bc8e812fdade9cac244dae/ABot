module.exports = (client, context) => {
    let discord = require('../utils/DiscordUtils')
    let fixansi = require('../utils/discordAnsiFix')

    let interval
    let canSend = true
    let queue = []

    // send(`Connecting to \`${context.options.host}:${context.options.port}\``)

    client.once('login', () => {
        send(`Logged in to \`${context.options.host}:${context.options.port}\``)
        interval = setInterval(() => {
            if (canSend === true && queue[0] !== undefined) {
                discord.sendMessageInstantly(context.serverConfig.discord.channelId, `\`\`\`ansi\n${queue.join('\n').substring(0, 1984)}\n\`\`\``)
                canSend = false
                queue = []
                setTimeout(() => {
                    canSend = true
                }, 1700)
            }
        }, 50)
    })

    client._client.on('message', msg => {
        queue.push(fixansi(msg.toAnsi()))
    })

    client.once('end', reason => {
        reason = reason.replaceAll(require('../private').PREMIUM_ACCOUNT.EMAIL, 'EMAIL')
        send(`[${client.connected ? 'Online' : 'Offline'}] -> Disconnected: \`${reason}\``)

        setTimeout(() => {
            if (interval) clearInterval(interval)
            interval = undefined
        }, 5000)
    })

    function send(message) {
        discord.sendMessage(context.serverConfig.discord.channelId, `${message}`)
    }
}