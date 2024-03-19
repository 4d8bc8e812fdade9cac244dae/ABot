module.exports = (context) => {
    let bot = context.bot
    let client = context.client
    let prefixes = context.prefixes

    client.on('allChat', (data) => {
        try {
            let sender = new client.ChatMessage(JSON.parse(data.rawSenderName)).toString()
            let msg = data.message
    
            if (
                msg.extra &&
                msg.extra.length === 5 &&
                msg.extra[2] &&
                msg.extra[2].text &&
                msg.extra[2].text === '»' &&
                msg.extra[3] &&
                msg.extra[3].text &&
                msg.extra[3].text === ' '
            ) {
                let message = new client.ChatMessage(msg.extra[4]).toString()
    
                prefixes.forEach(prefix => {
                    if (message.toLowerCase().startsWith(prefix)) {
                        let [command, ...arguments] = message.substring(prefix.length).trim().split(' ')
    
                        client.emit('botCommand',
                            {
                                command: command,
                                arguments: arguments,
                                sender: sender,
                                uuid: data.uuid,
                                moreInfo: {
                                    prefix: prefix,
                                    chatType: 'player_chat'
                                }
                            }
                        )
                    }
                })
            }
        } catch {}
    })
}