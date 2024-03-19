module.exports = (client) => {
    let bot = client._client

    bot.position = {x: null, y: null, z: null}

    // Spawn teleportation and other stuff I guess meh.
    bot.on('packet', (data, meta) => {
        if (data !== undefined)
        if (meta.name === 'position' || meta.name === 'postion_look') {
            bot.position = {x: Math.round(data.x), y: Math.round(data.y), z: Math.round(data.z)}
            client.emit('updatePosition', bot.position)
            client.emit('spawn', bot.position)
        }
    })
}