module.exports = (client, context) => {
    let commands = context.commands
    // let coreDisabled = context.serverConfig.coreDisabled

    client.on('botCommand', (data) => {
        let type = data.moreInfo.chatType

        let command = data.command || ''
        let cmd = commands.find(item => item.name.toLowerCase() === command.toLowerCase() || item.aliases.includes(command.toLowerCase()))

        if (cmd) {
            try {
                cmd.execute(
                    {
                        client: client,
                        bot: client._client,
                        globalContext: context,
                        sendMessage: {
                            json: sendFeedback,
                            ampersand: sendFeedbackAmpersand,
                            chatType: type
                        },
                        contextData: data,
                    }
                )

                /*
                const parsedCommand = client.commandParser.generic(cmd.usages, data.arguments)

                if (parsedCommand.success === true && parsedCommand.error === undefined) {
                    cmd.execute(
                        {
                            client: client,
                            bot: client._client,
                            globalContext: context,
                            sendMessage: {
                                json: sendFeedback,
                                ampersand: sendFeedbackAmpersand,
                                chatType: type
                            },
                            contextData: data,
                        }
                    )
                } else if (parsedCommand.error !== undefined) {
                    sendFeedback({
                        text: require('../utils/ErrorTablesParserUtils')(parsedCommand.error) || parsedCommand.error,
                        color: 'red'
                    })
                }
                */
            } catch (e) {
                sendFeedback({
                    text: e.stack,
                    color: 'red'
                })
                client.logging.error(e.stack)
            }
        } else {
            switch (type) {
                case 'console':
                case 'discord':
                    sendFeedback(
                        {
                            text: 'Unknown command',
                            color: 'red'
                        }
                    )
                    break
            }
        }

        function sendFeedbackAmpersand(string) {
            sendFeedback(require('../utils/AmpersandColorUtils')(string))
        }

        function sendFeedback(json) {
            switch (type) {
                case 'system_chat':
                case 'player_chat':
                    client.core.tellraw(json)
                    break
                case 'console':
                    /*
                    client.core.tellraw(
                        [
                            '',
                            {
                                text: '[',
                                color: 'dark_gray',
                            },
                            {
                                text: 'Console',
                                color: 'red',
                            },
                            {
                                text: ']',
                                color: 'dark_gray',
                            },
                            {
                                text: ' ',
                                extra: [json]
                            },
                        ]
                    )
                    */

                    new client.ChatMessage(json).toAnsi().split('\n').forEach(line => {client.logging.log(line)})
                    break
                case 'discord':
                    let { EmbedBuilder } = require('discord.js')
                    data.moreInfo.discordMessage.reply({embeds: [
                        new EmbedBuilder()
                        .setTitle('Output')
                        .setDescription(`\`\`\`ansi\n${require('../utils/discordAnsiFix')(new client.ChatMessage(require('../utils/fixJsonUtils')(json)).toAnsi()).substring(0, 1950)}\n\`\`\``)
                        .setColor('#FFAA00')
                    ]})
                    break
                default:
                    throw new Error('Unknown type: ' + type)
            }
        }
    })
}