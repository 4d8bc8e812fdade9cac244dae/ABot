module.exports = (client, context) => {
    let bot = client._client
    let coreDisabled = context.serverConfig.coreDisabled
    let coreRateLimit = context.serverConfig.coreRateLimit

    // for coreRateLimit
    let queue = []
    let queueTimer

    client.core = {}
    client.core.data = {}

    client.core.data.position = {x: null, y: null, z: null}
    client.core.data.relativePosition = {x: 0, y: 0, z: 0}

    client.core.data.canUse = false

    client.once('spawn', () => {
        client.core.data.canUse = true
        client.core.move()

        if (coreRateLimit) {
            queueTimer = setInterval(() => {
                if (queue && queue[0] !== undefined) {
                    run(queue[0])
                    while (queue.length > 250) queue.shift()
                    queue.shift()
                }
            }, 10)
        }
    })

    client.once('end', () => {
        client.core.data.canUse = false

        queue = undefined
        if (queueTimer) clearInterval(queueTimer)
        queueTimer = undefined
    })

    client.on('updatePosition', position => {
        let old = client.core.data.position
        client.core.data.position = {x: getChunk(position.x), y: 0, z: getChunk(position.z)}
        if (client.core.data.position !== old) client.core.move()
    })

    client.core.canUseCommandBlocks = () => {
        return client.isCreative && client.isOperator
    }

    client.core.run = (command) => {
        if (coreRateLimit) {
            if (queue) {
                try {
                    queue.push(command)
                } catch {}
            }
        } else {
            run(command)
        }
    }

    function run(command) {
        if (coreDisabled) return
        if (client.core.data.canUse === false) return
        
        bot.write('update_command_block', {
            location: {
                x: client.core.data.position.x + client.core.data.relativePosition.x,
                y: client.core.data.position.y + client.core.data.relativePosition.y,
                z: client.core.data.position.z + client.core.data.relativePosition.z,
            },
            command: String(command).substring(0, 32767),
            mode: 1,
            flags: 0b101
        })

        client.core.data.relativePosition.x++
        if (client.core.data.relativePosition.x >= 16) {
            client.core.data.relativePosition.x = 0
            client.core.data.relativePosition.z++
            if (client.core.data.relativePosition.z >= 16) {
                client.core.data.relativePosition.z = 0
            }
        }
    }

    client.core.move = () => {
        if (client.core.data.canUse === false) return
        if (coreDisabled) return
        client.chat(`/fill ${
            client.core.data.position.x
        } ${
            client.core.data.position.y
        } ${
            client.core.data.position.z
        } ${
            client.core.data.position.x + 15
        } ${
            client.core.data.position.y
        } ${
            client.core.data.position.z + 15
        } repeating_command_block replace`)
    }

    function getChunk(value) {
        return Math.floor(value / 16) * 16
    }

    client.core.tellraw = (json) => {
        if (coreDisabled || client.core.canUseCommandBlocks() === false) {
            new client.ChatMessage(json).toMotd().replaceAll('§', '&').split('\n').forEach(line => {client.chat(`${line}`.substring(0, 255))})
        } else {
            client.core.run(`minecraft:tellraw @a ${JSON.stringify(json)}`)
        }
    }
}