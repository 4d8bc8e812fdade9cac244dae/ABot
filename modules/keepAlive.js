const MathUtils = require('../utils/MathUtils')

module.exports = (client, context) => {
    let bot = client._client
    const disconnectAfter = 30 * 1000

    let time = 0
    let interval

    bot.on('packet', () => {
        time = 0
    })

    client.on('login', () => {
        interval = setInterval(() => {
            if (new MathUtils(time).isBiggerThan(disconnectAfter)) {
                bot.end('Timed out')
                if (interval) clearInterval(interval)
            }
            else time++
        }, 1)
    })

    client.once('end', () => {
        if (interval) clearInterval(interval)
    })

    bot.on('keep_alive', (packet) => {
        bot.write('keep_alive', {
            keepAliveId: packet.keepAliveId
        })
    })
}