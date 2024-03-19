module.exports = (client) => {
    let bot = client._client
    let ChatMessage = client.ChatMessage

    bot.on('systemChat', data => {
        try {JSON.parse(data.formattedMessage)} catch (e) {return}
        try {
            let dmsg = JSON.parse(data.formattedMessage)
            if (dmsg.translate === 'advMode.setCommand.success') return
            if (dmsg.translate === 'advMode.notAllowed') return
            let msg = new ChatMessage(require('../utils/fixJsonUtils')(dmsg))
            bot.emit('message', msg)
            bot.emit('systemMessage', msg)
        } catch {}
    })

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
        if (data.type === 4) if (data.formattedMessage !== undefined) bot.emit('message', new ChatMessage(require('../utils/fixJsonUtils')(JSON.parse(data.formattedMessage))))
        if (data.type === 5) {
            if (data.sender !== undefined) { // Player /say
                bot.emit('message', new ChatMessage(
                    require('../utils/fixJsonUtils')({
                        translate: 'chat.type.announcement',
                        with: [
                            JSON.parse(data.senderName),
                            data.plainMessage,
                        ]
                    }
                )))
            } else { // Command Block /say
                bot.emit('message', new ChatMessage(
                    require('../utils/fixJsonUtils')({
                        translate: 'chat.type.announcement',
                        with: [
                            JSON.parse(data.senderName),
                            JSON.parse(data.formattedMessage),
                        ]
                    }
                )))
            }
        }
    })

    bot.on('packet', (data, meta) => {
        if (meta.name === 'player_chat' && data && data.unsignedChatContent) {
            bot.emit('message', new ChatMessage(require('../utils/fixJsonUtils')(JSON.parse(data.unsignedChatContent))))
        }
    })
}