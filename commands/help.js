let CommandPermissionLevelUtils = require('../utils/CommandPermissionLevelUtils')

module.exports = {
    name: 'help',
    aliases: ['heko', 'cmds', 'commands', '?'],
    description: 'Tests if the bot is working.',
    usages: [
        {
            argument: null,
            executable: true,
            children: []
        }
    ],
    trust: 0,
    execute(context) {
        let commands = context.globalContext.commands
        let component = []

        let startingComponent = [
            {
                text: 'Commands ',
                color: context.globalContext.config.colors.accent
            },
            {
                text: '(',
                color: 'dark_gray'
            },
            {
                text: `${commands.length}`,
                color: context.globalContext.config.colors.settings.good
            },
            {
                text: ')',
                color: 'dark_gray'
            },
            {
                text: ' '
            },
            {
                text: '(',
                color: 'dark_gray'
            },
            {
                text: '',
                extra: [CommandPermissionLevelUtils.json]
            },
            {
                text: ')',
                color: 'dark_gray'
            },
            {
                text: ' - ',
                color: 'dark_gray'
            }
        ]
        
        startingComponent.forEach(item => {
            component.push(item)
        })

        commands.sort((a, b) => {
            let d = a.name
            let c = b.name
          
            if (c > d) {
              return -1
            }
            if (c < d) {
              return 1
            }
            return 0
        }).forEach((command, index) => {
            component.push(
                {
                    text: `${command.name}${index + 1 === command.length ? '' : ' '}`,
                    color: CommandPermissionLevelUtils.colorPalette[CommandPermissionLevelUtils.arrayPermissions.find(item => item.value === command.trust).name],
                    hoverEvent: {
                        action: 'show_text',
                        value: [
                            '',
                            {
                                text: 'Command name: ',
                                color: context.globalContext.config.colors.accent
                            },
                            {
                                text: command.name,
                                color: context.globalContext.config.colors.main
                            },
                            command.aliases.length !== 0 ? '\n' : '',
                            {
                                text: command.aliases.length !== 0 ? 'Command aliases: ' : '',
                                color: context.globalContext.config.colors.accent
                            },
                            {
                                text: command.aliases.length !== 0 ? command.aliases.join(', ') : '',
                                color: context.globalContext.config.colors.main
                            }
                        ]
                    }
                }
            )
        })

        context.sendMessage.json(component)
    },
}