module.exports = (client, context) => {
    let interval

    let filtered = []
    filtered = require('../utils/FilterUtils').get()

    client.once('login', () => {
        if (context.serverConfig.isCreayun === true) return
        interval = setInterval(() => {
            if (client === undefined || client._client === undefined || client._client.ended === true) return
            filtered = require('../utils/FilterUtils').get()
        }, 100)
    })

    let filterMessage = '§6§lABot §r§7Message filter'

    client.on('allChat', (data) => {
        try {
            let uuid = data.uuid
            let sender = new client.ChatMessage(JSON.parse(data.rawSenderName)).toString()
            let msg = data.message
    
            if (
                msg.extra &&
                msg.extra.length === 5 &&
                msg.extra[2] &&
                msg.extra[2].text &&
                msg.extra[2].text === ':' &&
                msg.extra[3] &&
                msg.extra[3].text &&
                msg.extra[3].text === ' '
            ) {
                let message = new client.ChatMessage(msg.extra[4]).toString()

                /** LAZY SMH
                checkMessage({
                    username: sender,
                    uuid: uuid,
                    message: message
                })
                 */
            }
        } catch {}
    })

    client.once('end', () => {
        if (interval) clearInterval(interval)
    })

    function checkMessage(data) {
        try {
            if (context.serverConfig.isCreayun === true) return

            let hasFiltered = false
    
            filtered.forEach(data => {
                if (hasFiltered) return
                let displayName = `${username}`
                let originalDisplayName = `${displayName}`
                if (displayName === client._client.username) return

                if (data.lowerCase === true) {
                    displayName = displayName.toLowerCase()
                    if (!data.regex) data.name = data.name.toLowerCase()
                }
    
                if (data.regex === true) {
                    let regex = new RegExp(data.name)
    
                    if (displayName.match(regex)) {
                        if (options.mute) {
                            options.customMuteReason = data.customMuteReason
                        }
                        runFilter(originalDisplayName, options)
                        hasFiltered = true
                        return
                    }
                }
                else {
                    if (data.name === displayName) {
                        if (options.mute) {
                            options.customMuteReason = data.customMuteReason
                        }
                        runFilter(originalDisplayName, options)
                        hasFiltered = true
                        return
                    }
                }
            })
        } catch {}
    }
}