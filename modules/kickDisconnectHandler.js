module.exports = (client) => {
    client.randomData.successfulLogin = false
    const timeOutMessage = 'Timed out'

    setTimeout(() => {
        if (client !== undefined && client._client !== undefined && client.randomData !== undefined) {
            if (client.randomData.successfulLogin !== true) {
                client._client.end(timeOutMessage)
            }
        }
    }, 60000)

    client._client.once('login', () => {
        client.randomData.successfulLogin = true
    })

    client._client.on('packet', (data, meta) => {
        if (!data) return

        if (meta.name === 'kick_disconnect' || meta.name === 'disconnect') {
            if (!data.reason) return
            try {JSON.parse(data.reason)} catch (e) {return}
            client.emit('end', new client.ChatMessage(JSON.parse(data.reason)).toString())
            client._client.end(new client.ChatMessage(JSON.parse(data.reason)).toString())
        }
    })

    client._client.once('end', (reason) => {
        client.emit('end', fixDefaultMessages(reason))
    })

    function fixDefaultMessages(reason) {
        switch (reason) {
            case 'socketClosed':
                return 'Disconnected'
            default:
                return reason
        }
    }

    client._client.once('error', (e) => {
        client.emit('end', e.message)
    })
}