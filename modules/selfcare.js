const MathUtils = require('../utils/MathUtils')

module.exports = (client, context) => {
    let disableSelfcares = context.serverConfig.disableSelfcares

    let bot = client._client
    let interval
    let moveCoreInterval

    let abuseCount = 0

    client.selfcare = {}
    client.selfcare.gameMode = 0
    client.selfcare.permissionLevel = 0
    client.selfcare.icuCounter = 0
    client.selfcare.commandSpy = false

    client.isCreative = false
    client.isOperator = false

    bot.once('login', packet => {
        client.selfcare.gameMode = packet.gameMode
        client.isCreative = packet.gameMode === 1

        if (context.serverConfig.isCreayun) {
            setTimeout(() => {
                client.chat('/server creative') // 5000ms should be enough
            }, 5000)
        }

        if (disableSelfcares) return

        interval = setInterval(() => {
            if (client === undefined) {
                clearInterval(interval)
                interval = undefined
            }
            if (new MathUtils(abuseCount).isBiggerThan(20)) client._client.end('Anti abuse')
            if (client.selfcare.permissionLevel !== undefined && client.selfcare.permissionLevel < 2) {
                client.chat('/op @s[type=player]')
                abuseCount++
            }
            else if (client.selfcare.gameMode !== undefined && client.selfcare.gameMode !== 1) {
                client.chat('/gamemode creative')
                abuseCount++
            }
            else if (client.selfcare.commandSpy !== undefined && client.selfcare.commandSpy === false) client.chat('/c on')
            else {
                if (new MathUtils(abuseCount).isSmallerThan(0)) abuseCount = 0
                else abuseCount--
            }
        }, 250)

        moveCoreInterval = setInterval(() => {
            client.core.move()
        }, 360000)
    })

    bot.once('end', () => {
        if (interval) clearInterval(interval)
        interval = undefined

        if (moveCoreInterval) clearInterval(moveCoreInterval)
        moveCoreInterval = undefined
    })

    client.on('updatePosition', position => {
        if (new MathUtils(client.selfcare.icuCounter).isBiggerThan(50)) {
            client._client.end('Anti iControlU')
        }
        if (new MathUtils(client.selfcare.icuCounter).isSmallerThan(0)) client.selfcare.icuCounter = 0
        client.selfcare.icuCounter++
        setTimeout(() => {
            try {
                client.selfcare.icuCounter--
            } catch {}
        }, 5000)
    })

    client.on('packet', (packet, meta) => {
        if (packet === undefined) return
        if (meta.name !== 'game_state_change') return
        if (packet.reason === 3) {
            client.selfcare.gameMode = packet.gameMode
            client.isCreative = packet.gameMode === 1
        }
        if (packet.reason === 4) {
            bot.write('client_command', { actionId: 0 })
        }
    })

    bot.on('packet', packet => {
        if (packet === undefined) return
        if (!packet.entityStatus) return
        if (packet.entityStatus < 24 || packet.entityStatus > 28) return
        client.selfcare.permissionLevel = packet.entityStatus - 24

        if (client.selfcare.permissionLevel < 2) {
            client.isOperator = false
        } else {
            client.isOperator = true
        }
    })

    bot.on('message', msg => {
        let strmsg = msg.toString()

        if (strmsg === 'Successfully enabled CommandSpy') client.selfcare.commandSpy = true
        if (strmsg === 'Successfully disabled CommandSpy') client.selfcare.commandSpy = false
    })
}