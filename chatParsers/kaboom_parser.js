module.exports = (context) => {
    let bot = context.bot
    let client = context.client
    let prefixes = context.prefixes

    bot.on('playerChat', (data) => {
        if (data !== undefined && data.type !== undefined) {
            if (data.type !== 4) return
            if (data.formattedMessage === undefined) return
            try {JSON.parse(data.formattedMessage)} catch {return}

            let name = new client.ChatMessage(JSON.parse(data.senderName)).toMotd()
            let player = client.tab.list.find(item => item.player.name.replace(/§./g, '') === name.replace(/§./g, ''))

            if (player === undefined) return

            client.emit('allChat', {
                message: JSON.parse(data.formattedMessage),
                rawSenderName: data.senderName,
                uuid: player.uuid
            })
        }
    })

    bot.on('packet', (data, meta) => {
        if (data === undefined || meta.name !== 'player_chat') return
        if (data.type !== undefined && data.type === 4) {
            if (data.unsignedChatContent === undefined) return
            client.emit('allChat', {
                message: JSON.parse(data.unsignedChatContent),
                rawSenderName: data.networkName,
                uuid: data.senderUuid
            })
        }
    })

    client.on('allChat', (data) => {
        try {
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