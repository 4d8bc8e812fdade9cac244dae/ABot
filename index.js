/* Catch uncaught exceptions */
const logErrors = true
const logRejections = false // sends errors like "SocketError: other side closed"
process.on('uncaughtException', (e) => {
    if (logErrors) {
        e.stack.split('\n').forEach(line => {
            console.log(`\x1B[31m[${
                new Date().toLocaleString()
            } ERROR] Uncaught Exception: ${line}\x1B[0m`)
        })
    }
}).on('unhandledRejection', (e) => {
    if (logErrors && logRejections) {
        e.stack.split('\n').forEach(line => {
            console.log(`\x1B[33m[${
                new Date().toLocaleString()
            } WARN] Uncaught Rejection: ${line}\x1B[0m`)
        })
    }
}).on('warning', (e) => {
    if (logErrors) {
        e.stack.split('\n').forEach(line => {
            console.log(`\x1B[33m[${
                new Date().toLocaleString()
            } WARN] Process Warning: ${line}\x1B[0m`)
        })
    }
})

/* Config file checking */
const initTasks = require('./initTasks')
initTasks()

/* Custom Modules */
const config = require('./config')
const bot = require('./bot')
let discordEnabled = require('fs').existsSync('./private.js')
const discord = require('./utils/DiscordUtils')
const dcClient = discord.getClient()

if (discordEnabled) {
    try {
        dcClient.login(require('./private').DISCORD.TOKEN)
    } catch (e) {
        discordEnabled = false
        console.log(`\x1B[33m[${
            new Date().toLocaleString()
        } WARN] Discord disabled (invalid token / rate limited)\x1B[0m`)
    }
} else {
    console.log(`\x1B[33m[${
        new Date().toLocaleString()
    } WARN] Discord disabled (no token found)\x1B[0m`)
}

/* Load Modules */
let commands = [
    require('./commands/amonger'),
    require('./commands/core'),
    require('./commands/creator'),
    require('./commands/echo'),
    require('./commands/eval'),
    require('./commands/getJson'),
    require('./commands/help'),
    require('./commands/list'),
//    require('./commands/memtest'),
//    require('./commands/memusage'),
    require('./commands/netmsg'),
    require('./commands/operatorList'),
    require('./commands/reconnect'),
    require('./commands/refillcore'),
    require('./commands/test'),
]
let modules = [
    require('./modules/advertise'),
    require('./modules/chat'),
    require('./modules/CommandArgumentParser'),
    require('./modules/commandHandler'),
    require('./modules/commandSource'),
    require('./modules/core'),
    require('./modules/discord'),
    require('./modules/filter'),
    require('./modules/keepAlive'),
    require('./modules/kickDisconnectHandler'),
    require('./modules/lockbot'),
    require('./modules/logging'),
    require('./modules/main'),
    require('./modules/messagefilter'),
    require('./modules/messages'),
    require('./modules/position'),
    require('./modules/selfcare'),
    require('./modules/tab'),
    require('./modules/whitelist'),
]
let chatParsers = [
    require('./chatParsers/5rz_parser'),
    require('./chatParsers/kaboom_parser'),
    require('./chatParsers/me_parser'),
    require('./chatParsers/totalfreedom_parser'),
    require('./chatParsers/u203a_parser'),
]

const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

/* Main Code */
let bots = []

rl.on('line', (message) => {
    bots.forEach(client => {
        if (client == undefined) return
        if (client.ended) return
        const [command, ...arguments] = message.trim().split(' ')

        const consoleName = 'Console'

        client.emit('botCommand', {
            command: command,
            arguments: arguments,
            sender: `${consoleName}`,
            uuid: '00000000-0000-0000-0000-000000000000',
            moreInfo: {
                prefix: 'None',
                chatType: 'console'
            }
        })
    })
})

dcClient.on('messageCreate', (msg) => {
    if (msg.author.id === dcClient.user.id) return
    bots.forEach(client => {
        if (client == undefined) return
        if (client.ended) return

        if (client.serverConfig.discord.channelId === msg.channelId) {
            let isCommand = false

            config.config.discordPrefixes.forEach(prefix => {
                if (msg.content.toLowerCase().startsWith(prefix.toLowerCase())) {
                    const [command, ...arguments] = msg.content.substring(prefix.length).trim().split(' ')

                    client.emit('botCommand', {
                        command: command,
                        arguments: arguments,
                        sender: `${msg.member.nickname || msg.author.displayName}`,
                        uuid: '00000000-0000-0000-0000-000000000000',
                        moreInfo: {
                            prefix: prefix,
                            chatType: 'discord',
                            discordMessage: msg
                        }
                    })
                    
                    isCommand = true

                    return
                }
            })

            if (isCommand === true) return

            let msgJson = []
            msgJson.push({
                text: '',
                extra: [require('./utils/AmpersandColorUtils')(msg.content)],
                color:'gray',
            })

            let json = {
                translate: '[%s] %s \u203a %s',
                color:'dark_gray',
                with: [
                    [
                        {
                            text: 'ABot',
                            color: 'gold',
                            bold: true,
                            hoverEvent: {
                                action:'show_text',
                                value: {
                                    text: 'Click to join the ABot Discord',
                                    color: 'blue'
                                }
                            },
                            clickEvent: {
                                action: 'open_url',
                                value: `${config.config.discordInviteLink}`
                            }
                        },
                        {
                            text: ' ',
                            hoverEvent: {
                                action:'show_text',
                                value: {
                                    text: 'Click to join the ABot Discord',
                                    color: 'blue'
                                }
                            },
                            clickEvent: {
                                action: 'open_url',
                                value: `${config.config.discordInviteLink}`
                            }
                        },
                        {
                            text: 'Discord',
                            color: 'blue',
                            bold: false,
                            hoverEvent: {
                                action:'show_text',
                                value: {
                                    text: 'Click to join the ABot Discord',
                                    color: 'blue'
                                }
                            },
                            clickEvent: {
                                action: 'open_url',
                                value: `${config.config.discordInviteLink}`
                            }
                        },
                    ],
                    {
                        text: '',
                        extra: [require('./utils/AmpersandColorUtils')(`${msg.member.nickname || msg.author.displayName}`.replace(/§/g, '&'))],
                        color: msg.member.displayHexColor === '#000000' ? 'red' : msg.member.displayHexColor
                    },
                    msgJson
                ]
            }

            client.core.tellraw(json)
        }
    })
})

dcClient.once('ready', () => {
    config.servers.forEach(server => {
        makebot(server)
    })
})

function makebot(server) {
    let client = bot(
        {
            options: { // Actual Bot config
                host: server.ip.split(':')[0] || 'localhost',
                port: server.ip.split(':')[1] || 25565,
                hideErrors: true,
                username: server.premium ? require('./private').PREMIUM_ACCOUNT.EMAIL : server.isCreayun ? require('./utils/RandomStringUtils')(7) : server.useInvalidName ? require('./utils/RandomStringUtilsAllChar')(Math.floor(Math.random() * 16) + 8).substring(0, 16) : require('./utils/RandomStringUtils')(Math.floor(Math.random() * 16) + 8).substring(0, 16),
                version: server.version || '1.20.2',
                auth: server.premium ? 'microsoft' : 'offline',
                keepAlive: false,
            },
            modules: modules, // Bot Modules
            commands: commands, // Bot Commands
            chatParsers: chatParsers,
            bots: bots, // All Bots
            config: config, // Global Config
            serverConfig: server
        }
    )

    bots.push(client)

    client.once('end', (reason) => {
        if (bots.indexOf(client) !== -1) bots[bots.indexOf(client)] = undefined
        else {/* How would it not have _bot if I pushed it? */}
        bots = bots.filter(item => item !== undefined)
        setTimeout(() => {
            makebot(server)
            client = undefined // clear out of ram I guess?
            setTimeout(() => {
                try {client._client.removeAllListeners()} catch {}
                try {client.removeAllListeners()} catch {}
            }, 60000) // 1 minute
        }, reason === 'Wait 5 seconds before connecting, thanks! :)'
        || 
        reason === 'Please allow 5 seconds between connections/disconnections per IP!'
        ||
        reason === 'Connection throttled! Please wait before reconnecting.'
        ? 6000 : 250)
    })
}