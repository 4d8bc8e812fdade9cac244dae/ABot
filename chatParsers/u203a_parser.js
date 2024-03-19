module.exports = (context) => {
    let bot = context.bot
    let client = context.client
    let prefixes = context.prefixes

    bot.on('packet', (data, meta) => {
        if (data === undefined) return

        if (meta.name !== 'system_chat') return

        if (data.content) {
            try {JSON.parse(data.content)} catch (e) {return}

            let msg = JSON.parse(data.content)

            if (
                msg &&
                msg.translate &&
                msg.translate === '[%s] %s \u203a %s' &&
                msg.with &&
                Array.isArray(msg.with) &&
                msg.with.length === 3 &&
                msg.with[0] &&
                msg.with[1] &&
                msg.with[1].text !== undefined &&
                msg.with[2] &&
                msg.with[2].text !== undefined
            ) {
                let sender = new client.ChatMessage(msg.with[1]).toString()
                let message = new client.ChatMessage(msg.with[2]).toString()

                prefixes.forEach(prefix => {
                    if (message.toLowerCase().startsWith(prefix.toLowerCase())) {
                        let [command, ...arguments] = message.substring(prefix.length).trim().split(' ')
    
                        client.emit('botCommand',
                            {
                                command: command,
                                arguments: arguments,
                                sender: sender,
                                uuid: require('../utils/GenerateOfflineUUIDUtils')(sender),
                                moreInfo: {
                                    prefix: prefix,
                                    chatType: 'system_chat'
                                }
                            }
                        )
                    }
                })
            }
        }
    })
}