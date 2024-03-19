module.exports = (client) => {
    client.connected = false

    client._client.on('connect', () => {
        client.connected = true
    })

    client._client.on('packet', (data, meta) => {
        client.emit('packet', data, meta)
    })

    client._client.once('login', (data) => {
        client.emit('login', data)
    })
}