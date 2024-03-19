module.exports = (client, context) => {
    let interval

    let whitelist = {}
    whitelist.list = []
    whitelist.whitelistEnabled = false

    whitelist = require('../utils/WhitelistUtils').get()

    client.once('login', () => {
        interval = setInterval(() => {
            whitelist = require('../utils/WhitelistUtils').get()

            if (!client || !client.tab || !client.tab.list) return

            client.tab.list.forEach(item => {
                if (!item) return
                if (item.gamemode !== 3) {checkPlayer(item)}
            })

            client.ops.forEach(op => {
                checkPlayer({player: {name: op}})
            })
        }, 100)
    })

    client.on('playerJoin', (data) => {
        try {
            if (context.serverConfig.isCreayun === true) return
            checkPlayer(data, data.uuid)
        } catch {}
    })

    client.on('allChat', (data) => {
        let name = new client.ChatMessage(JSON.parse(data.rawSenderName)).toString()
        checkPlayer({player: {name: name}}, data.uuid)
    })

    client.once('end', () => {
        if (interval) clearInterval(interval)
        interval = undefined
    })

    function checkPlayer(player, mute) {
        let isOnWhitelist = false

        let name = player.player.name

        whitelist.list.forEach(data => {
            if (isOnWhitelist) return
            let displayName = `${name}`
            if (displayName === client._client.username) return

            if (data.lowerCase === true) {
                displayName = displayName.toLowerCase()
                if (!data.regex) data.name = data.name.toLowerCase()
            }

            if (data.regex === true) {
                let regex = new RegExp(data.name)

                if (displayName.match(regex)) {
                    isOnWhitelist = true
                    return
                }
            }
            else {
                if (data.name === displayName) {
                    isOnWhitelist = true
                    return
                }
            }
        })

        if (!isOnWhitelist) {
            kick(name, mute)
        }
    }

    function kick(displayName, mute) {
        if (!whitelist.whitelistEnabled) return
        if (context.serverConfig.isCreayun === true) return
        if (displayName === client._client.username) return
        client.core.run(`execute run deop @a[name=${JSON.stringify(displayName)}]`)
        client.core.run(`gamemode spectator @a[name=${JSON.stringify(displayName)}]`)
        client.core.run(`clear @a[name=${JSON.stringify(displayName)}]`)
        if (mute) {
            client.core.run(`mute ${mute} 10y §7Filtered by §6§lABot §8§o(whitelist)`)
        }
        /*
        client.core.run(`tellraw @a[name=${JSON.stringify(displayName)}] ${JSON.stringify({
            translate: 'translation.test.invalid',
            with: ['']
        })}`)
        client.core.run(`minecraft:tellraw @a[name=${JSON.stringify(displayName)}] "\\ud9ff蕜"`)
        client.core.run(`execute at @a[name=${JSON.stringify(displayName)}] run particle minecraft:dust_color_transition 1 0 0 1 0 1 1 ~ ~1 ~ 0 0 0 0 2147483647 force @s[type=player]`)
        client.core.run(`minecraft:item replace entity @a[name=${JSON.stringify(displayName)}] weapon.mainhand with allium{display: {Name: '{"translate":"%1$s.%1$s.%1$s.%1$s","with":[{"translate":"%1$s.%1$s.%1$s.%1$s","with":[{"translate":"%1$s.%1$s.%1$s.%1$s","with":[{"translate":"%1$s.%1$s.%1$s.%1$s","with":[{"translate":"%1$s.%1$s.%1$s.%1$s","with":[{"translate":"%1$s.%1$s.%1$s.%1$s","with":[{"translate":"%1$s.%1$s.%1$s.%1$s","with":[{"translate":"%1$s.%1$s.%1$s.%1$s","with":[{"translate":"%1$s.%1$s.%1$s.%1$s","with":[{"translate":"%1$s.%1$s.%1$s.%1$s","with":[{"translate":"%1$s.%1$s.%1$s.%1$s","with":[{"translate":"%1$s.%1$s.%1$s.%1$s","with":[{"translate":"%1$s.%1$s.%1$s.%1$s","with":[{"translate":"%1$s.%1$s.%1$s.%1$s","with":[{"translate":"%1$s.%1$s.%1$s.%1$s","with":[{"translate":"%1$s.%1$s.%1$s.%1$s","with":[{"translate":"%1$s.%1$s.%1$s.%1$s","with":[{"translate":"%1$s.%1$s.%1$s.%1$s","with":[{"translate":"%1$s.%1$s.%1$s.%1$s","with":[{"translate":"%1$s.%1$s.%1$s.%1$s","with":[{"translate":"%1$s.%1$s.%1$s.%1$s","with":[{"translate":"%1$s.%1$s.%1$s.%1$s","with":[{"translate":"%1$s.%1$s.%1$s.%1$s","with":[{"translate":"%1$s.%1$s.%1$s.%1$s","with":[{"translate":"%1$s.%1$s.%1$s.%1$s","with":[{"translate":"%1$s.%1$s.%1$s.%1$s","with":[{"translate":"%1$s.%1$s.%1$s.%1$s","with":[{"translate":"%1$s.%1$s.%1$s.%1$s","with":[{"translate":"%1$s.%1$s.%1$s.%1$s","with":[{"translate":"%1$s.%1$s.%1$s.%1$s","with":[{"translate":"%1$s.%1$s.%1$s.%1$s","with":[{"translate":"%1$s.%1$s.%1$s.%1$s","with":[{"translate":"%1$s.%1$s.%1$s.%1$s","with":[{"translate":"%1$s.%1$s.%1$s.%1$s","with":[{"translate":"%1$s.%1$s.%1$s.%1$s","with":[{"translate":"%1$s.%1$s.%1$s.%1$s","with":[{"translate":"%1$s.%1$s.%1$s.%1$s","with":[{"translate":"%1$s.%1$s.%1$s.%1$s","with":[{"translate":"%1$s.%1$s.%1$s.%1$s","with":[{"translate":"%1$s.%1$s.%1$s.%1$s","with":["wtflip1!"]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}]}'}}`)
        */
    }
}