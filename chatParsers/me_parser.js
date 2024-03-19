module.exports = (context) => {
    let bot = context.bot
    let client = context.client
    let prefixes = context.prefixes

    bot.on('playerChat', (data) => {
        if (data.type === 1) {
            try {
                let sender = ''
                let uuid = ''
                const senderJson = JSON.parse(data.senderName)
                if (
                    data.formattedMessage !== undefined &&
                    senderJson.insertion &&
                    senderJson.text &&
                    senderJson.hoverEvent &&
                    senderJson.clickEvent &&
                    senderJson.hoverEvent.action &&
                    senderJson.hoverEvent.action === 'show_entity' &&
                    senderJson.hoverEvent.contents &&
                    senderJson.hoverEvent.contents.id &&
                    senderJson.hoverEvent.contents.type === 'minecraft:player' &&
                    senderJson.hoverEvent.contents.name &&
                    senderJson.hoverEvent.contents.name.text !== undefined
                ) {
                    sender = new client.ChatMessage(senderJson.hoverEvent.contents.name).toString()
                    uuid = senderJson.hoverEvent.contents.id
                }
                if (!sender || !uuid) return
                const message = new client.ChatMessage(JSON.parse(data.formattedMessage)).toString()
                prefixes.forEach(prefix => {
                    if (message.toLowerCase().startsWith(prefix)) {
                        let [command, ...arguments] = message.substring(prefix.length).trim().split(' ')
    
                        client.emit('botCommand',
                            {
                                command: command,
                                arguments: arguments,
                                sender: sender,
                                uuid: uuid,
                                moreInfo: {
                                    prefix: prefix,
                                    chatType: 'player_chat'
                                }
                            }
                        )
                    }
                })
            } catch (e) { console.error(e.stack) }
        }
    })
}

/*
bot.on('playerChat', (data) => {
        try {
            if (data.sender) {
                bot.emit('playerMessage', data.sender)
            }
        } catch {}
        if (data.type === 1) { // All /me
            if (data.formattedMessage !== undefined)
            bot.emit('message', new ChatMessage(
                require('../utils/fixJsonUtils')({
                    translate: 'chat.type.emote',
                    with: [
                        JSON.parse(data.senderName),
                        JSON.parse(data.formattedMessage),
                    ]
                })
            ))
        }
*/