module.exports = (client, context) => {
    let checkDeopsInterval
    let ops = []

    client.ops = []

    let filtered = []
    filtered = require('../utils/FilterUtils').get()

    let filterMessage = '§7Filtered by §6§lABot'

    client.on('playerJoin', (data) => {
        try {
            if (context.serverConfig.isCreayun === true) return
            checkPlayer(data.player.name, {
                op: true,
                gamemode: true,
                mute: data.uuid,
            })
        } catch {}
    })

    client.on('allChat', (data) => {
        let name = new client.ChatMessage(JSON.parse(data.rawSenderName)).toString()
        checkPlayer(name, {
            op: false,
            gamemode: false,
            mute: data.uuid,
        })
    })

    client.once('login', () => {
        if (context.serverConfig.isCreayun === true) return
        checkDeopsInterval = setInterval(() => {
            if (client === undefined || client._client === undefined || client._client.ended === true) return
            filtered = require('../utils/FilterUtils').get()
            checkPlayersForFiltered()

            client.tab.tabComplete('/deop ').then(result => {
                if (result) {
                    ops = []
                    client.ops = []

                    result.matches.forEach(match => {
                        ops.push(match.match)
                        client.ops.push(match.match)
                    })

                    ops.forEach(op => {
                        checkPlayer(op, {
                            op: true,
                            gamemode: false,
                            mute: false
                        })                        
                    })
                }
            }).catch(e => {
                console.error(e)
            })
        }, 100)
    })

    client.once('end', () => {
        if (checkDeopsInterval) clearInterval(checkDeopsInterval)
    })

    function checkPlayersForFiltered() {
        try {
            if (context.serverConfig.isCreayun === true) return
            client.tab.list.forEach(item => {
                if (item.gamemode !== 3) checkPlayer(item.player.name, {
                    op: false,
                    gamemode: true,
                    mute: false
                })
            })
        } catch {}
    }

    function checkPlayer(username, options) {
        try {
            if (context.serverConfig.isCreayun === true) return

            let hasFiltered = false
    
            filtered.forEach(data => {
                if (hasFiltered) return
                let displayName = `${username}`
                let originalDisplayName = `${displayName}`
                if (displayName === client._client.username) return

                if (data.lowerCase === true) {
                    displayName = displayName.toLowerCase()
                    if (!data.regex) data.name = data.name.toLowerCase()
                }
    
                if (data.regex === true) {
                    let regex = new RegExp(data.name)
    
                    if (displayName.match(regex)) {
                        if (options.mute) {
                            options.customMuteReason = data.customMuteReason
                        }
                        runFilter(originalDisplayName, options)
                        hasFiltered = true
                        return
                    }
                }
                else {
                    if (data.name === displayName) {
                        if (options.mute) {
                            options.customMuteReason = data.customMuteReason
                        }
                        runFilter(originalDisplayName, options)
                        hasFiltered = true
                        return
                    }
                }
            })
        } catch {}
    }

    function gamemode(displayName) {
        try {
            if (context.serverConfig.isCreayun === true) return
            client.core.run(`gamemode spectator @a[name=${JSON.stringify(displayName)}]`)
        } catch {}
    }

    function operator(displayName) {
        try {
            if (context.serverConfig.isCreayun === true) return
            client.core.run(`execute run deop @a[name=${JSON.stringify(displayName)}]`)
        } catch {}
    }

    function mute(uuid, customMuteReason) {
        try {
            if (context.serverConfig.isCreayun === true) return
            client.core.run(`mute ${uuid} 10y${filterMessage ? ` ${filterMessage}${customMuteReason ? `§r§7. Reason for filter: §6${customMuteReason}` : ''}` : ''}`)
        } catch {}
    }

    function runFilter(displayName, options) {
        if (options.mute) {
            mute(options.mute, options.customMuteReason)
        }
        if (options.op) {
            operator(displayName)
        }
        if (options.gamemode) {
            gamemode(displayName)
        }
    }
}