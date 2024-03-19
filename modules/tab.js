module.exports = (client, context) => {
    let bot = client._client
    client.tab = {}

    // Tab Complete

    client.tab.tabComplete = async (command) => {
        return new Promise((resolve, reject) => {
            let timeoutId
            let timeout = 60000
            let id = Math.floor(Math.random() * 1000000000) // floor it or else it won't work

            bot.write('tab_complete', { text: `${command}`, transactionId: id })

            let responseHandler = (response, meta) => {
                if (response === undefined) return
                if (meta.name === 'tab_complete') {
                    if (response.transactionId !== id) return
                    clearTimeout(timeoutId)
                    bot.removeListener('packet', responseHandler)
                    resolve(response)
                }
            }

            bot.on('packet', responseHandler)

            timeoutId = setTimeout(() => {
                bot.removeListener('packet', responseHandler)
                return undefined
            }, timeout)
        }).catch((e) => {
            console.error(e)
            return undefined
        })
    }

    // Tab List

    client.tab.list = []

    function findPlayer(uuid) {
        return client.tab.list.find(player => player.uuid === uuid)
    }

    client.tab.findPlayerUUID = (uuid) => {
        return findPlayer(uuid) // player or undefined
    }

    function hasPlayer(uuid) {
        return findPlayer(uuid) !== undefined
    }
    
    function removePlayer(uuid) {
        let i = client.tab.list.findIndex(player => player.uuid === uuid)

        if (i === -1) return

        try {
            client.tab.list[i] = undefined
            client.tab.list = client.tab.list.filter(player => player !== undefined)
        } catch {}
    }

    bot.on('packet', (data, meta) => {
        if (data === undefined) return
        if (meta.name !== 'player_info') return

        let players = data.data

        try {
            switch (data.action) {
                case 63: // Add Player
                    players.forEach(player => {
                        if (hasPlayer(player.uuid) === true) return
    
                        client.tab.list.push(player)
    
                        client.emit('playerJoin', player)
                        client.emit('playerUpdate', {action: data.action, player: player})
                    })
                    break
                case 32: // Update displayName
                    players.forEach(player => {
                        findPlayer(player.uuid).displayName = player.displayName
                        client.emit('playerUpdate', {action: data.action, player: findPlayer(player.uuid)})
                    })
                    break
                case 16: // Update latency
                    players.forEach(player => {
                        findPlayer(player.uuid).latency = player.latency
                        client.emit('playerUpdate', {action: data.action, player: findPlayer(player.uuid)})
                    })
                    break
                case 4: // update gamemode
                    players.forEach(player => {
                        findPlayer(player.uuid).gamemode = player.gamemode
                        client.emit('playerUpdate', {action: data.action, player: findPlayer(player.uuid)})
                    })
                    break
            }
        } catch (e) {
            // debuging: console.error(e.stack)
        }
    })

    bot.on('packet', (packet, meta) => {
        if (packet === undefined) return
        if (meta.name !== 'player_remove') return

        if (context.serverConfig.isCreayun) {
            packet.players.forEach(player => {
                removePlayer(player)
            })
        } else {
            client.tab.tabComplete('/scoreboard players add ').then(result => {
                if (result) {
                    let matches = []
                    
                    result.matches.forEach(match => {
                        if (match.tooltip === undefined) {
                            matches.push(match.match)
                        }
                    })
    
                    packet.players.forEach(uuid => {
                        let player = findPlayer(uuid)
                        if (player !== undefined) {
                            if (matches.findIndex(item => item === player.player.name) === -1) {
                                removePlayer(player.uuid)
                                client.emit('playerLeft', player)
                            }
                        } else {
                            client.tab.list = client.tab.list.filter(player => player !== undefined)
                        }
                    })
                }
            }).catch(e => {
                console.error(e)
            })
        }
    })

    /*

    client.on('playerJoin', (data) => {
        if (data === undefined || data.player === undefined) return

        client.core.tellraw(
            [
                '',
                {
                    text: '[',
                    color: 'dark_gray'
                },
                {
                    text: '+',
                    color: 'green'
                },
                {
                    text: ']',
                    color: 'dark_gray'
                },
                {
                    text: ' ',
                },
                {
                    text: data.player.name,
                    color: 'gray'
                }
            ]
        )
    })

    client.on('playerLeft', (data) => {
        if (data === undefined || data.player === undefined) return

        client.core.tellraw(
            [
                '',
                {
                    text: '[',
                    color: 'dark_gray'
                },
                {
                    text: '-',
                    color: 'red'
                },
                {
                    text: ']',
                    color: 'dark_gray'
                },
                {
                    text: ' ',
                },
                {
                    text: data.player.name,
                    color: 'gray'
                }
            ]
        )
    })

    */
}